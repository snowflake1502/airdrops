/**
 * Automation Rules
 * Defines and evaluates automation rules
 */

import { AutomationConfig, PositionInfo, RuleEvaluationResult } from './types'
import { supabase } from '@/lib/supabase'

export class RulesEvaluator {
  private config: AutomationConfig

  constructor(config: AutomationConfig) {
    this.config = config
  }

  /**
   * Evaluate all rules and return actions to execute
   */
  async evaluateRules(positions: PositionInfo[]): Promise<RuleEvaluationResult[]> {
    const results: RuleEvaluationResult[] = []

    for (const position of positions) {
      // Rule 1: Auto-Claim Fees
      if (this.config.auto_claim_fees) {
        const claimResult = await this.evaluateClaimFeesRule(position)
        if (claimResult.shouldExecute) {
          results.push(claimResult)
        }
      }

      // Rule 2: Auto-Rebalance
      if (this.config.auto_rebalance) {
        const rebalanceResult = await this.evaluateRebalanceRule(position)
        if (rebalanceResult.shouldExecute) {
          results.push(rebalanceResult)
        }
      }
    }

    // Rule 3: Auto-Open Position (if no active positions)
    if (this.config.auto_open_position && positions.length === 0) {
      const openResult = await this.evaluateOpenPositionRule()
      if (openResult.shouldExecute) {
        results.push(openResult)
      }
    }

    return results
  }

  /**
   * Rule 1: Auto-Claim Fees
   */
  private async evaluateClaimFeesRule(position: PositionInfo): Promise<RuleEvaluationResult> {
    // Check if fees meet threshold
    if (position.unclaimed_fees_usd < this.config.claim_fee_threshold_usd) {
      return {
        shouldExecute: false,
        actionType: 'claim_fees',
        estimatedCostUSD: 0.001 * 190, // ~$0.19 gas fee estimate
        reason: `Unclaimed fees $${position.unclaimed_fees_usd.toFixed(2)} below threshold $${this.config.claim_fee_threshold_usd.toFixed(2)}`,
        requiresApproval: false
      }
    }

    // Check cooldown period
    if (position.last_claim_at) {
      const lastClaimTime = new Date(position.last_claim_at).getTime()
      const cooldownMs = this.config.claim_fee_interval_hours * 60 * 60 * 1000
      const timeSinceClaim = Date.now() - lastClaimTime

      if (timeSinceClaim < cooldownMs) {
        const hoursRemaining = (cooldownMs - timeSinceClaim) / (60 * 60 * 1000)
        return {
          shouldExecute: false,
          actionType: 'claim_fees',
          estimatedCostUSD: 0.001 * 190,
          reason: `Cooldown period active. ${hoursRemaining.toFixed(1)} hours remaining`,
          requiresApproval: false
        }
      }
    }

    // Estimate gas fee (~0.001 SOL = ~$0.19)
    const estimatedGasFeeUSD = 0.001 * 190

    return {
      shouldExecute: true,
      actionType: 'claim_fees',
      positionAddress: position.position_address,
      positionNftAddress: position.position_nft_address,
      estimatedCostUSD: estimatedGasFeeUSD,
      reason: `Unclaimed fees $${position.unclaimed_fees_usd.toFixed(2)} meet threshold. Gas fee: $${estimatedGasFeeUSD.toFixed(2)}`,
      requiresApproval: false // Fee claims are small, no approval needed
    }
  }

  /**
   * Rule 2: Auto-Rebalance
   */
  private async evaluateRebalanceRule(position: PositionInfo): Promise<RuleEvaluationResult> {
    // Check if position is out of range
    if (!position.is_out_of_range) {
      return {
        shouldExecute: false,
        actionType: 'rebalance',
        estimatedCostUSD: 0,
        reason: 'Position is in range, no rebalance needed',
        requiresApproval: false
      }
    }

    // Check cooldown period
    if (position.last_rebalance_at) {
      const lastRebalanceTime = new Date(position.last_rebalance_at).getTime()
      const cooldownMs = this.config.rebalance_cooldown_hours * 60 * 60 * 1000
      const timeSinceRebalance = Date.now() - lastRebalanceTime

      if (timeSinceRebalance < cooldownMs) {
        const hoursRemaining = (cooldownMs - timeSinceRebalance) / (60 * 60 * 1000)
        return {
          shouldExecute: false,
          actionType: 'rebalance',
          estimatedCostUSD: 0,
          reason: `Rebalance cooldown active. ${hoursRemaining.toFixed(1)} hours remaining`,
          requiresApproval: false
        }
      }
    }

    // Estimate cost (gas fees for close + open)
    const estimatedGasFeeUSD = 0.002 * 190 // ~$0.38 for two transactions

    // Check if requires approval
    const requiresApproval = this.config.require_manual_approval && 
                            position.total_usd > this.config.approval_threshold_usd

    return {
      shouldExecute: true,
      actionType: 'rebalance',
      positionAddress: position.position_address,
      positionNftAddress: position.position_nft_address,
      estimatedCostUSD: estimatedGasFeeUSD,
      reason: `Position out of range. Value: $${position.total_usd.toFixed(2)}. Estimated gas: $${estimatedGasFeeUSD.toFixed(2)}`,
      requiresApproval
    }
  }

  /**
   * Rule 3: Auto-Open Position
   */
  private async evaluateOpenPositionRule(): Promise<RuleEvaluationResult> {
    // Check if enough time has passed since last position open
    const { data: lastOpen } = await supabase
      .from('automation_logs')
      .select('created_at')
      .eq('user_id', this.config.user_id)
      .eq('action_type', 'open_position')
      .eq('status', 'executed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastOpen) {
      const lastOpenTime = new Date(lastOpen.created_at).getTime()
      const minIntervalMs = this.config.min_days_between_opens * 24 * 60 * 60 * 1000
      const timeSinceOpen = Date.now() - lastOpenTime

      if (timeSinceOpen < minIntervalMs) {
        const daysRemaining = (minIntervalMs - timeSinceOpen) / (24 * 60 * 60 * 1000)
        return {
          shouldExecute: false,
          actionType: 'open_position',
          estimatedCostUSD: this.config.min_position_size_usd,
          reason: `Minimum ${this.config.min_days_between_opens} days between opens. ${daysRemaining.toFixed(1)} days remaining`,
          requiresApproval: false
        }
      }
    }

    // Check current position count
    const { data: activePositions } = await supabase
      .from('position_transactions')
      .select('position_nft_address')
      .eq('user_id', this.config.user_id)
      .eq('wallet_address', this.config.wallet_address)
      .eq('tx_type', 'position_open')
      .not('position_nft_address', 'is', null)

    // Get unique position count
    const uniquePositions = new Set(activePositions?.map(p => p.position_nft_address) || [])
    
    // Check for closed positions
    const { data: closedPositions } = await supabase
      .from('position_transactions')
      .select('position_nft_address')
      .eq('user_id', this.config.user_id)
      .eq('wallet_address', this.config.wallet_address)
      .eq('tx_type', 'position_close')

    const closedSet = new Set(closedPositions?.map(p => p.position_nft_address) || [])
    const activeCount = Array.from(uniquePositions).filter(addr => !closedSet.has(addr)).length

    if (activeCount >= this.config.max_positions) {
      return {
        shouldExecute: false,
        actionType: 'open_position',
        estimatedCostUSD: this.config.min_position_size_usd,
        reason: `Maximum positions (${this.config.max_positions}) reached`,
        requiresApproval: false
      }
    }

    const estimatedCostUSD = this.config.min_position_size_usd + (0.001 * 190) // Position + gas
    const requiresApproval = this.config.require_manual_approval && 
                            estimatedCostUSD > this.config.approval_threshold_usd

    return {
      shouldExecute: true,
      actionType: 'open_position',
      estimatedCostUSD,
      reason: `No active positions. Opening new position with $${this.config.min_position_size_usd.toFixed(2)}`,
      requiresApproval
    }
  }
}


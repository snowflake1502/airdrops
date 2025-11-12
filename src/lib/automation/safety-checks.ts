/**
 * Safety Checks
 * Validates actions before execution to prevent errors and protect capital
 */

import { AutomationConfig, SafetyCheckResult, PositionInfo } from './types'
import { BudgetManager } from './budget-manager'

export class SafetyChecker {
  private config: AutomationConfig
  private budgetManager: BudgetManager

  constructor(config: AutomationConfig) {
    this.config = config
    this.budgetManager = new BudgetManager(config)
  }

  /**
   * Check if action can be executed safely
   */
  async checkAction(
    actionType: 'open_position' | 'claim_fees' | 'rebalance' | 'close_position',
    estimatedCostUSD: number,
    positionInfo?: PositionInfo
  ): Promise<SafetyCheckResult> {
    const warnings: string[] = []

    // Budget check
    const budgetCheck = await this.budgetManager.canSpend(estimatedCostUSD)
    if (!budgetCheck.allowed) {
      return {
        allowed: false,
        reason: budgetCheck.reason
      }
    }

    // Action-specific checks
    switch (actionType) {
      case 'open_position':
        return this.checkOpenPosition(estimatedCostUSD)
      
      case 'claim_fees':
        return this.checkClaimFees(positionInfo, estimatedCostUSD)
      
      case 'rebalance':
        return this.checkRebalance(positionInfo, estimatedCostUSD)
      
      case 'close_position':
        return this.checkClosePosition(positionInfo)
      
      default:
        return { allowed: false, reason: 'Unknown action type' }
    }
  }

  /**
   * Check if position can be opened
   */
  private async checkOpenPosition(estimatedCostUSD: number): Promise<SafetyCheckResult> {
    // Check position size limits
    if (estimatedCostUSD < this.config.min_position_size_usd) {
      return {
        allowed: false,
        reason: `Position size $${estimatedCostUSD.toFixed(2)} is below minimum $${this.config.min_position_size_usd.toFixed(2)}`
      }
    }

    if (estimatedCostUSD > this.config.max_position_size_usd) {
      return {
        allowed: false,
        reason: `Position size $${estimatedCostUSD.toFixed(2)} exceeds maximum $${this.config.max_position_size_usd.toFixed(2)}`
      }
    }

    // Check max positions (would need to query current positions)
    // This is checked in the rules evaluation

    return { allowed: true }
  }

  /**
   * Check if fees can be claimed
   */
  private async checkClaimFees(
    positionInfo: PositionInfo | undefined,
    estimatedCostUSD: number
  ): Promise<SafetyCheckResult> {
    if (!positionInfo) {
      return { allowed: false, reason: 'Position info not provided' }
    }

    // Check if position has claimable fees
    if (positionInfo.unclaimed_fees_usd < this.config.claim_fee_threshold_usd) {
      return {
        allowed: false,
        reason: `Unclaimed fees $${positionInfo.unclaimed_fees_usd.toFixed(2)} below threshold $${this.config.claim_fee_threshold_usd.toFixed(2)}`
      }
    }

    // Check gas fee is reasonable (< 10% of claimable amount)
    const gasFeePercent = (estimatedCostUSD / positionInfo.unclaimed_fees_usd) * 100
    if (gasFeePercent > 10) {
      return {
        allowed: false,
        reason: `Gas fee $${estimatedCostUSD.toFixed(2)} is ${gasFeePercent.toFixed(1)}% of claimable fees (max 10%)`
      }
    }

    return { allowed: true }
  }

  /**
   * Check if position can be rebalanced
   */
  private async checkRebalance(
    positionInfo: PositionInfo | undefined,
    estimatedCostUSD: number
  ): Promise<SafetyCheckResult> {
    if (!positionInfo) {
      return { allowed: false, reason: 'Position info not provided' }
    }

    // Check if position is worth rebalancing (> $10)
    if (positionInfo.total_usd < 10) {
      return {
        allowed: false,
        reason: `Position value $${positionInfo.total_usd.toFixed(2)} is too low to rebalance`
      }
    }

    // Check if position is actually out of range
    if (!positionInfo.is_out_of_range) {
      return {
        allowed: false,
        reason: 'Position is still in range, no rebalance needed'
      }
    }

    return { allowed: true }
  }

  /**
   * Check if position can be closed
   */
  private async checkClosePosition(
    positionInfo: PositionInfo | undefined
  ): Promise<SafetyCheckResult> {
    if (!positionInfo) {
      return { allowed: false, reason: 'Position info not provided' }
    }

    // Position can always be closed (user owns it)
    return { allowed: true }
  }
}


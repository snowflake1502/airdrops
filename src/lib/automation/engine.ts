/**
 * Automation Engine
 * Main orchestrator for automation system
 */

import { AutomationConfig, PositionInfo, AutomationLog } from './types'
import { RulesEvaluator } from './rules'
import { AutomationExecutor } from './executor'
import { PositionFetcher } from './position-fetcher'
import { supabase } from '@/lib/supabase'

export class AutomationEngine {
  private config: AutomationConfig
  private rulesEvaluator: RulesEvaluator
  private executor: AutomationExecutor
  private positionFetcher: PositionFetcher

  constructor(config: AutomationConfig) {
    this.config = config
    this.rulesEvaluator = new RulesEvaluator(config)
    this.executor = new AutomationExecutor(config)
    this.positionFetcher = new PositionFetcher()
  }

  /**
   * Run automation cycle
   * This is called periodically (e.g., every 5 minutes)
   */
  async run(): Promise<{
    success: boolean
    actionsExecuted: number
    actionsPendingApproval: number
    errors: string[]
  }> {
    const errors: string[] = []

    try {
      // Check if automation is active
      if (!this.config.is_active) {
        return {
          success: true,
          actionsExecuted: 0,
          actionsPendingApproval: 0,
          errors: ['Automation is not active']
        }
      }

      // Fetch current positions
      const positions = await this.positionFetcher.getActivePositions(
        this.config.user_id,
        this.config.wallet_address
      )

      // Evaluate rules
      const ruleResults = await this.rulesEvaluator.evaluateRules(positions)

      let actionsExecuted = 0
      let actionsPendingApproval = 0

      // Execute each action
      for (const ruleResult of ruleResults) {
        try {
          const positionInfo = positions.find(
            p => p.position_nft_address === ruleResult.positionNftAddress
          )

          const result = await this.executor.executeAction(ruleResult, positionInfo)

          if (result.requiresApproval) {
            actionsPendingApproval++
          } else {
            actionsExecuted++
          }
        } catch (error: any) {
          errors.push(`Error executing action: ${error.message}`)
          console.error('Error executing automation action:', error)
        }
      }

      // Update last run time
      await supabase
        .from('automation_configs')
        .update({ last_run_at: new Date().toISOString() })
        .eq('id', this.config.id)

      return {
        success: true,
        actionsExecuted,
        actionsPendingApproval,
        errors
      }
    } catch (error: any) {
      errors.push(`Engine error: ${error.message}`)
      return {
        success: false,
        actionsExecuted: 0,
        actionsPendingApproval: 0,
        errors
      }
    }
  }

  /**
   * Get automation status
   */
  async getStatus(): Promise<{
    isActive: boolean
    lastRunAt: string | null
    activePositions: number
    pendingApprovals: number
    recentLogs: AutomationLog[]
  }> {
    const positions = await this.positionFetcher.getActivePositions(
      this.config.user_id,
      this.config.wallet_address
    )

    const { data: approvals } = await supabase
      .from('automation_approvals')
      .select('id')
      .eq('user_id', this.config.user_id)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())

    const { data: logs } = await supabase
      .from('automation_logs')
      .select('*')
      .eq('user_id', this.config.user_id)
      .eq('config_id', this.config.id)
      .order('created_at', { ascending: false })
      .limit(10)

    return {
      isActive: this.config.is_active,
      lastRunAt: this.config.last_run_at,
      activePositions: positions.length,
      pendingApprovals: approvals?.length || 0,
      recentLogs: (logs || []) as AutomationLog[]
    }
  }
}


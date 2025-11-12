/**
 * Automation Executor
 * Handles execution of automation actions (or creates approvals)
 */

import { AutomationConfig, AutomationLog, RuleEvaluationResult, PositionInfo } from './types'
import { supabase } from '@/lib/supabase'
import { SafetyChecker } from './safety-checks'
import { BudgetManager } from './budget-manager'

export class AutomationExecutor {
  private config: AutomationConfig
  private safetyChecker: SafetyChecker
  private budgetManager: BudgetManager

  constructor(config: AutomationConfig) {
    this.config = config
    this.safetyChecker = new SafetyChecker(config)
    this.budgetManager = new BudgetManager(config)
  }

  /**
   * Execute an automation action
   * Returns the created log entry
   */
  async executeAction(
    ruleResult: RuleEvaluationResult,
    positionInfo?: PositionInfo
  ): Promise<{ log: AutomationLog; requiresApproval: boolean; approvalId?: string }> {
    // Safety check
    const safetyCheck = await this.safetyChecker.checkAction(
      ruleResult.actionType,
      ruleResult.estimatedCostUSD,
      positionInfo
    )

    if (!safetyCheck.allowed) {
      // Create a failed log entry
      const log = await this.createLog({
        actionType: ruleResult.actionType,
        status: 'failed',
        positionAddress: ruleResult.positionAddress || null,
        positionNftAddress: ruleResult.positionNftAddress || null,
        estimatedCostUSD: ruleResult.estimatedCostUSD,
        reason: safetyCheck.reason || 'Safety check failed',
        errorMessage: safetyCheck.reason
      })

      return { log, requiresApproval: false }
    }

    // Check if approval is required
    const requiresApproval = ruleResult.requiresApproval || 
                            (this.config.require_manual_approval && 
                             ruleResult.estimatedCostUSD > this.config.approval_threshold_usd)

    if (requiresApproval) {
      // Create pending log and approval request
      const log = await this.createLog({
        actionType: ruleResult.actionType,
        status: 'pending',
        positionAddress: ruleResult.positionAddress || null,
        positionNftAddress: ruleResult.positionNftAddress || null,
        estimatedCostUSD: ruleResult.estimatedCostUSD,
        reason: ruleResult.reason,
        requiresApproval: true
      })

      const approvalId = await this.createApprovalRequest(log, ruleResult, positionInfo)

      return { log, requiresApproval: true, approvalId }
    }

    // Auto-executable action (e.g., small fee claims)
    // For now, we'll create a log entry marked as "pending"
    // Actual execution requires wallet connection (to be implemented)
    const log = await this.createLog({
      actionType: ruleResult.actionType,
      status: 'pending', // Will be updated to 'executed' when transaction completes
      positionAddress: ruleResult.positionAddress || null,
      positionNftAddress: ruleResult.positionNftAddress || null,
      estimatedCostUSD: ruleResult.estimatedCostUSD,
      reason: ruleResult.reason,
      requiresApproval: false
    })

    // TODO: Execute transaction via wallet connection
    // For now, log is created and can be executed manually or via scheduled job

    return { log, requiresApproval: false }
  }

  /**
   * Create automation log entry
   */
  private async createLog(data: {
    actionType: RuleEvaluationResult['actionType']
    status: AutomationLog['status']
    positionAddress?: string | null
    positionNftAddress?: string | null
    estimatedCostUSD: number
    reason: string
    errorMessage?: string
    requiresApproval?: boolean
  }): Promise<AutomationLog> {
    const logData = {
      user_id: this.config.user_id,
      config_id: this.config.id,
      action_type: data.actionType,
      status: data.status,
      position_address: data.positionAddress,
      position_nft_address: data.positionNftAddress,
      amount_usd: data.estimatedCostUSD,
      triggered_by: 'rule' as const,
      rule_name: `auto_${data.actionType}`,
      error_message: data.errorMessage || null,
      cost_usd: 0, // Will be updated after execution
      gas_fee_sol: 0, // Will be updated after execution
      metadata: {
        reason: data.reason,
        requiresApproval: data.requiresApproval || false
      }
    }

    const { data: log, error } = await supabase
      .from('automation_logs')
      .insert(logData)
      .select()
      .single()

    if (error) throw error

    return log as AutomationLog
  }

  /**
   * Create approval request
   */
  private async createApprovalRequest(
    log: AutomationLog,
    ruleResult: RuleEvaluationResult,
    positionInfo?: PositionInfo
  ): Promise<string> {
    const approvalData = {
      log_id: log.id,
      user_id: this.config.user_id,
      config_id: this.config.id,
      action_type: ruleResult.actionType,
      details: {
        positionAddress: ruleResult.positionAddress,
        positionNftAddress: ruleResult.positionNftAddress,
        positionInfo: positionInfo ? {
          total_usd: positionInfo.total_usd,
          unclaimed_fees_usd: positionInfo.unclaimed_fees_usd,
          is_out_of_range: positionInfo.is_out_of_range
        } : null,
        reason: ruleResult.reason
      },
      estimated_cost_usd: ruleResult.estimatedCostUSD,
      status: 'pending' as const
    }

    const { data: approval, error } = await supabase
      .from('automation_approvals')
      .insert(approvalData)
      .select()
      .single()

    if (error) throw error

    return approval.id
  }

  /**
   * Update log after execution
   */
  async updateLogAfterExecution(
    logId: string,
    transactionSignature: string,
    actualCostUSD: number,
    gasFeeSOL: number,
    success: boolean
  ): Promise<void> {
    const updateData: any = {
      transaction_signature: transactionSignature,
      cost_usd: actualCostUSD,
      gas_fee_sol: gasFeeSOL,
      status: success ? 'executed' : 'failed',
      executed_at: success ? new Date().toISOString() : null,
      failed_at: success ? null : new Date().toISOString()
    }

    await supabase
      .from('automation_logs')
      .update(updateData)
      .eq('id', logId)

    // Update budget if successful
    if (success) {
      await this.budgetManager.recordSpend(actualCostUSD)
    }
  }
}


/**
 * Automation Engine Types
 * Type definitions for the automation system
 */

export type AutomationActionType = 
  | 'open_position' 
  | 'claim_fees' 
  | 'rebalance' 
  | 'close_position' 
  | 'monitor'

export type AutomationStatus = 
  | 'pending' 
  | 'approved' 
  | 'executed' 
  | 'failed' 
  | 'rejected' 
  | 'cancelled'

export type TriggerSource = 'rule' | 'manual' | 'scheduled'

export interface AutomationConfig {
  id: string
  user_id: string
  wallet_address: string
  
  // Budget Controls
  total_budget_usd: number
  spent_usd: number
  max_position_size_usd: number
  min_position_size_usd: number
  
  // Automation Rules
  auto_claim_fees: boolean
  claim_fee_threshold_usd: number
  claim_fee_interval_hours: number
  
  auto_rebalance: boolean
  rebalance_threshold_percent: number
  rebalance_cooldown_hours: number
  
  auto_open_position: boolean
  min_days_between_opens: number
  
  // Safety Controls
  max_positions: number
  max_daily_spend_usd: number
  require_manual_approval: boolean
  approval_threshold_usd: number
  
  // Status
  is_active: boolean
  last_run_at: string | null
  created_at: string
  updated_at: string
}

export interface AutomationLog {
  id: string
  user_id: string
  config_id: string
  action_type: AutomationActionType
  status: AutomationStatus
  transaction_signature: string | null
  position_address: string | null
  position_nft_address: string | null
  amount_usd: number | null
  triggered_by: TriggerSource
  rule_name: string | null
  error_message: string | null
  cost_usd: number
  gas_fee_sol: number
  metadata: Record<string, any>
  created_at: string
  executed_at: string | null
  failed_at: string | null
}

export interface AutomationApproval {
  id: string
  log_id: string
  user_id: string
  config_id: string
  action_type: AutomationActionType
  details: Record<string, any>
  estimated_cost_usd: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  created_at: string
  approved_at: string | null
  rejected_at: string | null
  expires_at: string
  rejection_reason: string | null
}

export interface PositionInfo {
  position_nft_address: string
  position_address: string
  token_x_symbol: string
  token_y_symbol: string
  token_x_amount: number
  token_y_amount: number
  total_usd: number
  unclaimed_fees_usd: number
  is_out_of_range: boolean
  fee_apr_24h: number
  opened_at: string
  last_claim_at: string | null
  last_rebalance_at: string | null
}

export interface RuleEvaluationResult {
  shouldExecute: boolean
  actionType: AutomationActionType
  positionAddress?: string
  positionNftAddress?: string
  estimatedCostUSD: number
  reason: string
  requiresApproval: boolean
}

export interface BudgetState {
  totalBudgetUSD: number
  spentUSD: number
  reservedUSD: number
  availableUSD: number
  dailySpend: Array<{
    date: string
    amount: number
  }>
}

export interface SafetyCheckResult {
  allowed: boolean
  reason?: string
  warnings?: string[]
}


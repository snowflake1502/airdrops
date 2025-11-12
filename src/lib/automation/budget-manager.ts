/**
 * Budget Manager
 * Tracks and enforces budget limits for automation
 */

import { AutomationConfig, BudgetState } from './types'
import { supabase } from '@/lib/supabase'

export class BudgetManager {
  private config: AutomationConfig

  constructor(config: AutomationConfig) {
    this.config = config
  }

  /**
   * Get current budget state
   */
  async getBudgetState(): Promise<BudgetState> {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Get today's spend from automation logs
    const { data: logs } = await supabase
      .from('automation_logs')
      .select('cost_usd, created_at')
      .eq('user_id', this.config.user_id)
      .eq('config_id', this.config.id)
      .eq('status', 'executed')
      .gte('created_at', today)

    const todaySpend = logs?.reduce((sum, log) => sum + (log.cost_usd || 0), 0) || 0

    // Get last 7 days of spending
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: recentLogs } = await supabase
      .from('automation_logs')
      .select('cost_usd, created_at')
      .eq('user_id', this.config.user_id)
      .eq('config_id', this.config.id)
      .eq('status', 'executed')
      .gte('created_at', sevenDaysAgo.toISOString())

    // Group by date
    const dailySpend: Record<string, number> = {}
    recentLogs?.forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0]
      dailySpend[date] = (dailySpend[date] || 0) + (log.cost_usd || 0)
    })

    // Get reserved amount from pending approvals
    const { data: approvals } = await supabase
      .from('automation_approvals')
      .select('estimated_cost_usd')
      .eq('user_id', this.config.user_id)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())

    const reservedUSD = approvals?.reduce((sum, a) => sum + (a.estimated_cost_usd || 0), 0) || 0

    return {
      totalBudgetUSD: this.config.total_budget_usd,
      spentUSD: this.config.spent_usd,
      reservedUSD,
      availableUSD: this.config.total_budget_usd - this.config.spent_usd - reservedUSD,
      dailySpend: Object.entries(dailySpend).map(([date, amount]) => ({ date, amount }))
    }
  }

  /**
   * Check if action is allowed based on budget
   */
  async canSpend(amountUSD: number): Promise<{ allowed: boolean; reason?: string }> {
    const budget = await this.getBudgetState()

    // Check total budget
    if (amountUSD > budget.availableUSD) {
      return {
        allowed: false,
        reason: `Insufficient budget. Available: $${budget.availableUSD.toFixed(2)}, Required: $${amountUSD.toFixed(2)}`
      }
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0]
    const todaySpend = budget.dailySpend.find(d => d.date === today)?.amount || 0
    if (todaySpend + amountUSD > this.config.max_daily_spend_usd) {
      return {
        allowed: false,
        reason: `Daily limit exceeded. Today's spend: $${todaySpend.toFixed(2)}, Limit: $${this.config.max_daily_spend_usd.toFixed(2)}`
      }
    }

    return { allowed: true }
  }

  /**
   * Update spent amount after execution
   */
  async recordSpend(amountUSD: number): Promise<void> {
    const newSpent = this.config.spent_usd + amountUSD

    await supabase
      .from('automation_configs')
      .update({ 
        spent_usd: newSpent,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.config.id)

    // Update local config
    this.config.spent_usd = newSpent
  }

  /**
   * Get available budget
   */
  async getAvailableBudget(): Promise<number> {
    const budget = await this.getBudgetState()
    return budget.availableUSD
  }
}


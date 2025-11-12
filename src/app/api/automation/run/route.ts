/**
 * Automation Runner API
 * Endpoint to trigger automation cycle
 * Can be called manually or via cron job
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { AutomationEngine } from '@/lib/automation/engine'
import { AutomationConfig } from '@/lib/automation/types'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 }
      )
    }

    // Get automation config
    const { data: config, error: configError } = await supabase
      .from('automation_configs')
      .select('*')
      .eq('user_id', user.id)
      .eq('wallet_address', walletAddress)
      .single()

    if (configError || !config) {
      return NextResponse.json(
        { error: 'Automation config not found. Please approve a plan first.' },
        { status: 404 }
      )
    }

    // Create engine and run
    const engine = new AutomationEngine(config as AutomationConfig)
    const result = await engine.run()

    return NextResponse.json({
      success: result.success,
      actionsExecuted: result.actionsExecuted,
      actionsPendingApproval: result.actionsPendingApproval,
      errors: result.errors,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error running automation:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check automation status
 */
export async function GET(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 }
      )
    }

    // Get automation config
    const { data: config, error: configError } = await supabase
      .from('automation_configs')
      .select('*')
      .eq('user_id', user.id)
      .eq('wallet_address', walletAddress)
      .single()

    if (configError || !config) {
      return NextResponse.json(
        { error: 'Automation config not found' },
        { status: 404 }
      )
    }

    // Get status
    const engine = new AutomationEngine(config as AutomationConfig)
    const status = await engine.getStatus()

    return NextResponse.json(status)
  } catch (error: any) {
    console.error('Error getting automation status:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


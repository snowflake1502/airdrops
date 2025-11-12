/**
 * Automation Approval API
 * Endpoint to approve or reject pending automation actions
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { approvalId, action } = body // action: 'approve' or 'reject'

    if (!approvalId || !action) {
      return NextResponse.json(
        { error: 'approvalId and action are required' },
        { status: 400 }
      )
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    // Get approval
    const { data: approval, error: approvalError } = await supabase
      .from('automation_approvals')
      .select('*, automation_logs(*)')
      .eq('id', approvalId)
      .eq('user_id', user.id)
      .single()

    if (approvalError || !approval) {
      return NextResponse.json(
        { error: 'Approval not found' },
        { status: 404 }
      )
    }

    if (approval.status !== 'pending') {
      return NextResponse.json(
        { error: `Approval already ${approval.status}` },
        { status: 400 }
      )
    }

    // Check if expired
    if (new Date(approval.expires_at) < new Date()) {
      await supabase
        .from('automation_approvals')
        .update({ status: 'expired' })
        .eq('id', approvalId)

      return NextResponse.json(
        { error: 'Approval has expired' },
        { status: 400 }
      )
    }

    // Update approval
    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
      [action === 'approve' ? 'approved_at' : 'rejected_at']: new Date().toISOString()
    }

    if (action === 'reject' && body.reason) {
      updateData.rejection_reason = body.reason
    }

    await supabase
      .from('automation_approvals')
      .update(updateData)
      .eq('id', approvalId)

    // Update log status
    const logStatus = action === 'approve' ? 'approved' : 'rejected'
    await supabase
      .from('automation_logs')
      .update({ status: logStatus })
      .eq('id', approval.log_id)

    return NextResponse.json({
      success: true,
      message: `Action ${action}d successfully`,
      approvalId,
      status: logStatus
    })
  } catch (error: any) {
    console.error('Error processing approval:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


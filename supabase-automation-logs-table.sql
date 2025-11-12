-- Table for automation execution logs
-- Tracks all automation actions (executed, pending, failed)

CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  config_id UUID REFERENCES automation_configs(id) ON DELETE CASCADE,
  
  -- Action details
  action_type TEXT NOT NULL CHECK (action_type IN ('open_position', 'claim_fees', 'rebalance', 'close_position', 'monitor')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'executed', 'failed', 'rejected', 'cancelled')),
  
  -- Transaction details
  transaction_signature TEXT,
  position_address TEXT,
  position_nft_address TEXT,
  amount_usd DECIMAL(12,2),
  
  -- Execution details
  triggered_by TEXT DEFAULT 'rule' CHECK (triggered_by IN ('rule', 'manual', 'scheduled')),
  rule_name TEXT,
  error_message TEXT,
  
  -- Budget impact
  cost_usd DECIMAL(12,2) DEFAULT 0.00,
  gas_fee_sol DECIMAL(18,9) DEFAULT 0.00,
  
  -- Additional metadata (JSONB for flexibility)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_automation_logs_user ON automation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_config ON automation_logs(config_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON automation_logs(status);
CREATE INDEX IF NOT EXISTS idx_automation_logs_action_type ON automation_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON automation_logs(created_at DESC);

-- Enable RLS
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs
CREATE POLICY "Users can view own automation logs"
  ON automation_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System can insert logs (via service role)
-- Note: In production, use service role key for inserts
CREATE POLICY "Users can insert own automation logs"
  ON automation_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own logs
CREATE POLICY "Users can update own automation logs"
  ON automation_logs FOR UPDATE
  USING (auth.uid() = user_id);


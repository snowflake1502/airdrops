-- Table for pending automation approvals
-- Stores actions that require manual approval before execution

CREATE TABLE IF NOT EXISTS automation_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_id UUID REFERENCES automation_logs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  config_id UUID REFERENCES automation_configs(id) ON DELETE CASCADE,
  
  -- Action details
  action_type TEXT NOT NULL CHECK (action_type IN ('open_position', 'rebalance', 'close_position')),
  details JSONB NOT NULL,  -- Full action details (position address, amounts, etc.)
  estimated_cost_usd DECIMAL(12,2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- User feedback
  rejection_reason TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automation_approvals_user ON automation_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_approvals_log ON automation_approvals(log_id);
CREATE INDEX IF NOT EXISTS idx_automation_approvals_status ON automation_approvals(status);
CREATE INDEX IF NOT EXISTS idx_automation_approvals_expires ON automation_approvals(expires_at);

-- Enable RLS
ALTER TABLE automation_approvals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own approvals
CREATE POLICY "Users can view own automation approvals"
  ON automation_approvals FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own approvals
CREATE POLICY "Users can insert own automation approvals"
  ON automation_approvals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own approvals
CREATE POLICY "Users can update own automation approvals"
  ON automation_approvals FOR UPDATE
  USING (auth.uid() = user_id);


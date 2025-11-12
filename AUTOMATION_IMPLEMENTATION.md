# 🤖 Automation Engine Implementation

## ✅ What Was Built

A complete automation system for airdrop farming that evaluates rules, executes actions (or creates approvals), and tracks everything in a comprehensive log system.

---

## 📁 Files Created

### Database Tables (SQL)
1. **`supabase-automation-logs-table.sql`**
   - Stores all automation actions (executed, pending, failed)
   - Tracks transaction signatures, costs, and metadata
   - Full audit trail

2. **`supabase-automation-approvals-table.sql`**
   - Stores pending approval requests
   - Tracks expiration times and user decisions
   - Links to automation logs

### Core Engine (`src/lib/automation/`)
1. **`types.ts`**
   - TypeScript interfaces for all automation entities
   - Type definitions for actions, statuses, positions, etc.

2. **`budget-manager.ts`**
   - Tracks budget spending
   - Enforces daily and total budget limits
   - Calculates available budget

3. **`safety-checks.ts`**
   - Validates actions before execution
   - Checks position size limits, cooldowns, thresholds
   - Prevents unsafe operations

4. **`position-fetcher.ts`**
   - Fetches active positions from database
   - Queries Meteora API for current position data
   - Calculates unclaimed fees and position status

5. **`rules.ts`**
   - Evaluates automation rules
   - Rule 1: Auto-Claim Fees (when threshold met, cooldown passed)
   - Rule 2: Auto-Rebalance (when out of range, cooldown passed)
   - Rule 3: Auto-Open Position (when no positions, time passed)

6. **`executor.ts`**
   - Executes automation actions
   - Creates approval requests when needed
   - Updates logs after execution

7. **`engine.ts`**
   - Main orchestrator
   - Runs automation cycle
   - Coordinates all components

### API Endpoints (`src/app/api/automation/`)
1. **`run/route.ts`**
   - POST: Trigger automation run manually
   - GET: Get automation status
   - Requires authentication and wallet address

2. **`approve/route.ts`**
   - POST: Approve or reject pending actions
   - Updates approval and log status
   - Requires authentication

### UI Updates
1. **`src/app/dashboard/activities/page.tsx`**
   - Added "Automation Activity" tab
   - Shows pending approvals with approve/reject buttons
   - Displays automation logs in a table
   - "Run Automation Now" button for manual triggers

---

## 🔄 How It Works

### 1. Automation Cycle Flow

```
User Approves Plan
    ↓
Automation Config Created (is_active = true)
    ↓
Automation Engine Runs (every 5 min or manually)
    ↓
Position Fetcher → Gets active positions
    ↓
Rules Evaluator → Checks each rule
    ↓
Safety Checker → Validates each action
    ↓
Executor → Creates log + approval (if needed)
    ↓
User Approves → Action executes → Log updated
```

### 2. Rule Evaluation

**Rule 1: Auto-Claim Fees**
- ✅ Unclaimed fees >= threshold ($5 default)
- ✅ Last claim >= cooldown (24h default)
- ✅ Gas fee < 10% of claimable amount
- **Action**: Claim fees (no approval needed if small)

**Rule 2: Auto-Rebalance**
- ✅ Position out of range (fee_apr_24h = 0%)
- ✅ Position value > $10
- ✅ Last rebalance >= cooldown (6h default)
- **Action**: Close + Open new position (approval needed if > $100)

**Rule 3: Auto-Open Position**
- ✅ No active positions
- ✅ Last open >= min days (7 default)
- ✅ Budget available
- ✅ Under max positions limit
- **Action**: Open new position (approval needed if > $100)

### 3. Safety Checks

Before any action executes:
- ✅ Budget check (total + daily limits)
- ✅ Position size limits (min/max)
- ✅ Cooldown periods
- ✅ Position count limits
- ✅ Gas fee reasonableness

### 4. Approval System

Actions requiring approval:
- Position opens > $100
- Rebalances > $100
- Any action > approval_threshold

Approval flow:
1. Executor creates log (status: 'pending')
2. Executor creates approval request
3. User sees approval in Activities page
4. User approves/rejects
5. If approved, action can execute (requires wallet connection)

---

## 🚀 Usage

### 1. Setup Database Tables

Run these SQL files in Supabase:
```sql
-- Run in Supabase SQL Editor
\i supabase-automation-logs-table.sql
\i supabase-automation-approvals-table.sql
```

### 2. Approve a Plan

When user approves a plan in the dashboard:
- `approved_plans` table gets entry
- `automation_configs` table gets entry with `is_active = true`
- Automation is ready to run

### 3. Run Automation

**Manual Run:**
- Go to Activities page → Automation Activity tab
- Click "Run Automation Now"
- System evaluates rules and creates logs/approvals

**Scheduled Run (Future):**
- Set up cron job to call `/api/automation/run` every 5 minutes
- Or use Vercel Cron Jobs

### 4. Review Pending Approvals

- Go to Activities page → Automation Activity tab
- See pending approvals with details
- Click "Approve" or "Reject"
- System updates logs accordingly

### 5. View Automation Logs

- Activities page → Automation Activity tab
- See all automation actions
- Filter by status, action type, etc.
- Click transaction links to view on Solscan

---

## 📊 Database Schema

### `automation_logs`
- Tracks every automation action
- Links to `automation_configs`
- Stores transaction signatures, costs, status

### `automation_approvals`
- Stores pending approval requests
- Links to `automation_logs`
- Tracks expiration and user decisions

### `automation_configs` (already exists)
- Stores automation settings per wallet
- Budget limits, rules, safety controls
- Status and last run time

---

## 🔐 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ API endpoints require authentication
- ✅ Budget limits prevent over-spending
- ✅ Approval system for large actions

---

## 🎯 Next Steps (Future Enhancements)

1. **Transaction Execution**
   - Integrate with Solana wallet adapter
   - Execute transactions when approved
   - Update logs with transaction signatures

2. **Scheduled Automation**
   - Set up cron job (Vercel Cron or external service)
   - Run automation every 5 minutes automatically

3. **Notifications**
   - Email/push notifications for pending approvals
   - Alerts for failed actions

4. **Advanced Rules**
   - Price-based rebalancing
   - Multi-protocol strategies
   - Dynamic position sizing

5. **Analytics Dashboard**
   - Automation performance metrics
   - Cost analysis
   - Success rates

---

## 🐛 Troubleshooting

### Automation not running?
- Check `automation_configs.is_active = true`
- Verify wallet address matches
- Check API endpoint authentication

### No positions found?
- Ensure wallet has synced transactions
- Check `position_transactions` table has data
- Verify position NFT addresses are correct

### Approvals not showing?
- Check `automation_approvals` table
- Verify approval hasn't expired
- Check user_id matches

### Budget errors?
- Check `automation_configs` budget settings
- Verify `spent_usd` is correct
- Check daily spend limits

---

## 📝 Notes

- **Transaction Execution**: Currently, the system creates logs and approvals, but actual transaction execution requires wallet connection. This is a future enhancement.

- **Position Data**: Position data is fetched from Meteora API. If API is unavailable, positions may not be detected.

- **Cooldowns**: Cooldown periods prevent excessive automation. Adjust in `automation_configs` if needed.

- **Budget Tracking**: Budget is tracked in `automation_configs.spent_usd`. This is updated after successful executions.

---

## ✅ Status

**Completed:**
- ✅ Database tables
- ✅ Core engine components
- ✅ API endpoints
- ✅ UI for logs and approvals
- ✅ Rule evaluation
- ✅ Safety checks
- ✅ Budget management

**Pending:**
- ⏳ Actual transaction execution (requires wallet integration)
- ⏳ Scheduled automation (cron job)
- ⏳ Notifications
- ⏳ Advanced analytics

---

The automation engine is now ready to use! Users can approve plans, and the system will evaluate rules and create approval requests for actions that need user confirmation.


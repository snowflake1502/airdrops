# 🔧 Fix: Environment Variables Not Loading

## Problem
Next.js 15 with Turbopack sometimes doesn't reload `.env.local` files properly, especially after the file is created or modified.

## Symptoms
- `hasUrl: false, hasKey: false` in debug output
- Warnings about missing environment variables
- App works with fallbacks but warnings persist

## Solutions (Try in Order)

### Solution 1: Full Restart with Cache Clear ⭐ (Most Effective)
```powershell
# 1. Stop the dev server (Ctrl+C)

# 2. Clear Next.js cache
Remove-Item -Recurse -Force .next

# 3. Clear node_modules/.cache if it exists
if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache }

# 4. Restart dev server
npm run dev
```

### Solution 2: Verify .env.local Location
The `.env.local` file **MUST** be in the **root directory** (same level as `package.json`):
```
airdrop-dashboard/
├── .env.local          ← Must be here
├── package.json
├── next.config.ts
└── src/
```

### Solution 3: Check File Encoding
The `.env.local` file should be UTF-8 encoded without BOM:
- Open in VS Code
- Check bottom-right corner for encoding
- If not UTF-8, click and select "Save with Encoding" → "UTF-8"

### Solution 4: Verify File Format
Make sure `.env.local` has:
- No spaces around `=`
- No quotes around values (unless the value itself contains spaces)
- No trailing spaces
- One variable per line

**Correct format:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://mcakqykdtxlythsutgpx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Wrong format:**
```bash
NEXT_PUBLIC_SUPABASE_URL = https://...  # ❌ Spaces around =
NEXT_PUBLIC_SUPABASE_URL="https://..."  # ❌ Quotes (usually not needed)
```

### Solution 5: Check for Hidden Characters
Sometimes copy-paste can introduce hidden characters. Re-type the variables manually.

### Solution 6: Use dotenv Explicitly (Last Resort)
If nothing works, you can explicitly load dotenv:

1. Install dotenv:
```bash
npm install dotenv
```

2. Create `next.config.ts` with explicit loading:
```typescript
import type { NextConfig } from "next";
import { config } from 'dotenv';

// Load .env.local explicitly
config({ path: '.env.local' });

const nextConfig: NextConfig = {
  // ... rest of config
};
```

## Verification

After restarting, check the terminal for:
```
🔍 Supabase Env Check: { hasUrl: true, hasKey: true, urlLength: 40, keyLength: 208 }
```

If you see `hasUrl: true` and `hasKey: true`, the env vars are loading correctly!

## Why This Happens

Next.js 15 with Turbopack:
- Caches module initialization
- Environment variables are read at module load time
- If the module was cached before `.env.local` existed, it won't see the vars
- Clearing `.next` cache forces a fresh module load

## Current Status

Your `.env.local` file is **correct** and in the right location. The issue is Turbopack caching.

**Next Step**: Try Solution 1 (Full Restart with Cache Clear) - this fixes it 90% of the time.


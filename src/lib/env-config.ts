/**
 * Environment Configuration Helper
 * Handles reading environment variables in Next.js (both server and client)
 */

// Development-only: Try to read .env.local directly (workaround for Turbopack issue)
// NOTE: This function is server-side only and should never be called from client components
function tryReadEnvLocal(key: string): string {
  // Only run on server-side (Node.js environment)
  if (typeof window !== 'undefined') {
    // Client-side: skip this entirely
    return '';
  }
  
  if (typeof process === 'undefined' || process.env.NODE_ENV === 'production') {
    return '';
  }
  
  try {
    // Only try this in Node.js environment (server-side)
    // Use dynamic import to prevent bundling fs in client code
    if (typeof require !== 'undefined' && typeof window === 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(process.cwd(), '.env.local');
      
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
          
          const [envKey, ...valueParts] = trimmed.split('=');
          if (envKey.trim() === key) {
            const value = valueParts.join('=').trim();
            // Remove quotes if present
            return value.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  } catch (error) {
    // Silently fail - this is just a fallback
  }
  
  return '';
}

export function getEnvVar(key: string, fallback: string = ''): string {
  // Server-side: process.env is available
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value) return value;
  }
  
  // Client-side: Check window.__NEXT_DATA__ (Next.js exposes env vars here)
  if (typeof window !== 'undefined') {
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData?.env?.[key]) {
      return nextData.env[key];
    }
  }
  
  // Development fallback: Try reading .env.local directly (server-side only)
  // Only call this on server-side to avoid fs module bundling issues
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
    const envLocalValue = tryReadEnvLocal(key);
    if (envLocalValue) return envLocalValue;
  }
  
  return fallback;
}

export function getRpcUrl(): string {
  // Try multiple ways to get the RPC URL
  let rpcUrl = getEnvVar('NEXT_PUBLIC_SOLANA_RPC_URL') || 
               getEnvVar('SOLANA_RPC_URL') || '';
  
  // If still not found, try direct process.env access (for server-side)
  if (!rpcUrl && typeof process !== 'undefined' && process.env) {
    rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 
             process.env.SOLANA_RPC_URL || '';
  }
  
  // Client-side: Check window.__NEXT_DATA__ for env vars exposed by Next.js
  if (!rpcUrl && typeof window !== 'undefined') {
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData?.env?.NEXT_PUBLIC_SOLANA_RPC_URL) {
      rpcUrl = nextData.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
  }
  
  // Fallback to public RPC if env var not found (rate limited, but safe)
  // SECURITY: Never hardcode API keys in source code
  // In Vercel/production, env vars will be set via dashboard
  if (!rpcUrl || rpcUrl === 'https://api.mainnet-beta.solana.com') {
    // Use public Solana RPC as fallback (rate limited, but safe)
    rpcUrl = 'https://api.mainnet-beta.solana.com';
  }
  
  // Debug logging (development only) - after fallback is set
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const hasHelius = rpcUrl.includes('helius');
    const isPublic = rpcUrl === 'https://api.mainnet-beta.solana.com' || !rpcUrl;
    
    console.log('🔗 RPC URL Debug:', {
      found: !!rpcUrl,
      url: rpcUrl ? rpcUrl.substring(0, 60) + '...' : 'NOT FOUND',
      isHelius: hasHelius,
      isPublic: isPublic,
      sources: {
        getEnvVar: !!getEnvVar('NEXT_PUBLIC_SOLANA_RPC_URL'),
        processEnv: !!(typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SOLANA_RPC_URL),
        windowNextData: !!(typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SOLANA_RPC_URL)
      }
    });
    
    if (isPublic) {
      console.warn('⚠️ Using public Solana RPC (rate limited). Helius key not found.');
      console.warn('   Check: next.config.ts env section and .env.local file');
    } else if (hasHelius) {
      console.log('✅ Using Helius RPC');
    }
  }
  
  return rpcUrl.trim();
}



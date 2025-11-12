'use client'

import { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { getRpcUrl } from '@/lib/env-config'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

interface WalletContextProviderProps {
  children: ReactNode
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Use mainnet-beta for production, devnet for testing
  const network = WalletAdapterNetwork.Mainnet
  
  // Use a more reliable public RPC endpoint
  const endpoint = useMemo(() => {
    // Use the centralized env config helper
    const url = getRpcUrl()
    // Debug: Log which RPC is being used
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔗 WalletProvider RPC:', {
        url: url.substring(0, 60) + '...',
        isHelius: url.includes('helius'),
        isPublic: url === 'https://api.mainnet-beta.solana.com'
      })
    }
    return url
  }, [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}


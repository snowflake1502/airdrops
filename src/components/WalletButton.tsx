'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'

export default function WalletButton() {
  const { publicKey, connected, wallets } = useWallet()
  const [walletsReady, setWalletsReady] = useState(false)

  // Suppress WalletNotReadyError console errors (expected during initialization)
  useEffect(() => {
    const originalError = console.error
    const errorHandler = (...args: any[]) => {
      // Check if any argument contains WalletNotReadyError
      const hasWalletError = args.some((arg) => {
        if (typeof arg === 'string') {
          return arg.includes('WalletNotReadyError')
        }
        if (arg?.name === 'WalletNotReadyError' || arg?.message?.includes('WalletNotReadyError')) {
          return true
        }
        if (arg?.stack?.includes('WalletNotReadyError')) {
          return true
        }
        return false
      })
      
      // Suppress WalletNotReadyError - it's expected during wallet initialization
      if (hasWalletError) {
        return // Suppress this error silently
      }
      originalError.apply(console, args)
    }
    
    console.error = errorHandler

    return () => {
      console.error = originalError
    }
  }, [])

  // Wait for wallets to be ready before rendering the button
  useEffect(() => {
    // Check if wallets are available and ready
    if (wallets && wallets.length > 0) {
      // Give wallets a moment to initialize
      const timer = setTimeout(() => {
        setWalletsReady(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setWalletsReady(false)
    }
  }, [wallets])

  // Show loading state while wallets initialize
  if (!walletsReady) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {connected && publicKey && (
        <div className="hidden md:flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
        </div>
      )}
      <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-md !h-10" />
    </div>
  )
}


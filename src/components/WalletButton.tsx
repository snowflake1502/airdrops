'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function WalletButton() {
  const { publicKey, connected } = useWallet()

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


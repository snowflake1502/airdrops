/**
 * React Hook for Executing Automation Actions
 * Handles transaction building, signing, and execution
 */

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { getRpcUrl } from '@/lib/env-config'

export interface ExecuteActionResult {
  success: boolean
  signature?: string
  error?: string
  message?: string
}

export function useExecuteAction() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { publicKey, signTransaction, connected } = useWallet()

  const executeAction = async (logId: string): Promise<ExecuteActionResult> => {
    if (!connected || !publicKey || !signTransaction) {
      return {
        success: false,
        error: 'Wallet not connected. Please connect your wallet first.',
      }
    }

    setIsExecuting(true)
    setError(null)

    try {
      // Step 1: Build transaction
      const buildResponse = await fetch('/api/automation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId,
          walletAddress: publicKey.toBase58(),
        }),
      })

      if (!buildResponse.ok) {
        const errorData = await buildResponse.json()
        throw new Error(errorData.error || 'Failed to build transaction')
      }

      const { transaction: transactionBase64 } = await buildResponse.json()

      // Step 2: Deserialize transaction
      const transaction = Transaction.from(Buffer.from(transactionBase64, 'base64'))

      // Step 3: Sign transaction
      const signedTransaction = await signTransaction(transaction)

      // Step 4: Send signed transaction
      const executeResponse = await fetch('/api/automation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId,
          walletAddress: publicKey.toBase58(),
          signedTransaction: Buffer.from(signedTransaction.serialize()).toString('base64'),
        }),
      })

      if (!executeResponse.ok) {
        const errorData = await executeResponse.json()
        throw new Error(errorData.error || 'Failed to execute transaction')
      }

      const result = await executeResponse.json()

      return {
        success: true,
        signature: result.signature,
        message: result.message || 'Transaction executed successfully',
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to execute action'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsExecuting(false)
    }
  }

  return {
    executeAction,
    isExecuting,
    error,
    canExecute: connected && !!publicKey && !!signTransaction,
  }
}


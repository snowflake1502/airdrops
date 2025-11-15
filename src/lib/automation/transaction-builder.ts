/**
 * Transaction Builder for Automation Actions
 * Uses MCP Server for protocol integrations
 */

import { Transaction } from '@solana/web3.js'
import { getMCPClient } from '@/lib/mcp-client'

export interface BuildTransactionParams {
  actionType: 'claim_fees' | 'rebalance' | 'open_position'
  positionNftAddress?: string
  positionAddress?: string
  poolAddress?: string
  walletAddress: string
  // Additional params for open_position
  amountTokenX?: number
  amountTokenY?: number
  tokenXMint?: string
  tokenYMint?: string
}

export class TransactionBuilder {
  constructor() {
    // MCP client will be initialized on first use
  }

  /**
   * Build a transaction for claiming fees using MCP server
   */
  async buildClaimFeesTransaction(params: BuildTransactionParams): Promise<Transaction> {
    const { positionNftAddress, walletAddress } = params

    if (!positionNftAddress) {
      throw new Error('Position NFT address is required for claiming fees')
    }

    try {
      const mcpClient = await getMCPClient()
      const result = await mcpClient.claimFees({
        protocol: 'meteora',
        positionNftAddress,
        walletAddress,
      })

      if (!result.success || !result.transaction) {
        throw new Error(result.error || 'Failed to build claim fees transaction')
      }

      // Deserialize transaction from base64
      return Transaction.from(Buffer.from(result.transaction, 'base64'))
    } catch (error: any) {
      // Fallback: If MCP server is not available, provide helpful error
      if (error.message?.includes('MCP client not connected') || error.message?.includes('MCP server')) {
        throw new Error(
          'MCP server not available. Please ensure the MCP server is running. ' +
          'Error: ' + error.message
        )
      }
      throw error
    }
  }

  /**
   * Build a transaction for rebalancing a position using MCP server
   */
  async buildRebalanceTransaction(params: BuildTransactionParams): Promise<Transaction> {
    const { positionNftAddress, positionAddress, walletAddress } = params

    if (!positionNftAddress || !positionAddress) {
      throw new Error('Position NFT address and position address are required for rebalancing')
    }

    try {
      const mcpClient = await getMCPClient()
      const result = await mcpClient.rebalancePosition({
        protocol: 'meteora',
        positionNftAddress,
        positionAddress,
        walletAddress,
      })

      if (!result.success || !result.transaction) {
        throw new Error(result.error || 'Failed to build rebalance transaction')
      }

      // Deserialize transaction from base64
      return Transaction.from(Buffer.from(result.transaction, 'base64'))
    } catch (error: any) {
      if (error.message?.includes('MCP client not connected') || error.message?.includes('MCP server')) {
        throw new Error(
          'MCP server not available. Please ensure the MCP server is running. ' +
          'Error: ' + error.message
        )
      }
      throw error
    }
  }

  /**
   * Build a transaction for opening a new position using MCP server
   */
  async buildOpenPositionTransaction(params: BuildTransactionParams): Promise<Transaction> {
    const { poolAddress, walletAddress, amountTokenX, amountTokenY, tokenXMint, tokenYMint } = params

    if (!poolAddress) {
      throw new Error('Pool address is required for opening a position')
    }

    if (!amountTokenX || !amountTokenY || !tokenXMint || !tokenYMint) {
      throw new Error('Token amounts and mints are required for opening a position')
    }

    try {
      const mcpClient = await getMCPClient()
      const result = await mcpClient.openPosition({
        protocol: 'meteora',
        poolAddress,
        walletAddress,
        amountTokenX,
        amountTokenY,
        tokenXMint,
        tokenYMint,
      })

      if (!result.success || !result.transaction) {
        throw new Error(result.error || 'Failed to build open position transaction')
      }

      // Deserialize transaction from base64
      return Transaction.from(Buffer.from(result.transaction, 'base64'))
    } catch (error: any) {
      if (error.message?.includes('MCP client not connected') || error.message?.includes('MCP server')) {
        throw new Error(
          'MCP server not available. Please ensure the MCP server is running. ' +
          'Error: ' + error.message
        )
      }
      throw error
    }
  }

  /**
   * Build transaction based on action type
   */
  async buildTransaction(params: BuildTransactionParams): Promise<Transaction> {
    switch (params.actionType) {
      case 'claim_fees':
        return this.buildClaimFeesTransaction(params)
      case 'rebalance':
        return this.buildRebalanceTransaction(params)
      case 'open_position':
        return this.buildOpenPositionTransaction(params)
      default:
        throw new Error(`Unsupported action type: ${params.actionType}`)
    }
  }
}


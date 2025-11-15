/**
 * Shared types for MCP Server
 */

export interface Position {
  protocol: string
  positionNftAddress: string
  positionAddress: string
  poolAddress: string
  tokenX: {
    mint: string
    symbol: string
    amount: number
    price: number
  }
  tokenY: {
    mint: string
    symbol: string
    amount: number
    price: number
  }
  totalValueUSD: number
  unclaimedFeesUSD: number
  isOutOfRange: boolean
  feeAPR24h: number
}

export interface TransactionResult {
  success: boolean
  signature?: string
  error?: string
  transaction?: string // Base64 encoded transaction
}

export interface ClaimFeesParams {
  protocol: 'meteora' | 'jupiter' | 'sanctum'
  positionNftAddress: string
  walletAddress: string
}

export interface RebalanceParams {
  protocol: 'meteora' | 'jupiter' | 'sanctum'
  positionNftAddress: string
  positionAddress: string
  walletAddress: string
}

export interface OpenPositionParams {
  protocol: 'meteora' | 'jupiter' | 'sanctum'
  poolAddress: string
  walletAddress: string
  amountTokenX: number
  amountTokenY: number
  tokenXMint: string
  tokenYMint: string
}

export interface GetPositionsParams {
  protocol: 'meteora' | 'jupiter' | 'sanctum' | 'all'
  walletAddress: string
}


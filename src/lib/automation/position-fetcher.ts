/**
 * Position Fetcher
 * Fetches current position data from database and Meteora API
 */

import { supabase } from '@/lib/supabase'
import { PositionInfo } from './types'

export class PositionFetcher {
  /**
   * Get all active positions for a wallet
   */
  async getActivePositions(userId: string, walletAddress: string): Promise<PositionInfo[]> {
    const positions: PositionInfo[] = []

    try {
      // Get positions from database
      const { data: dbPositions, error } = await supabase
        .from('position_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('wallet_address', walletAddress)
        .order('block_time', { ascending: false })

      if (error) throw error

      // Group by position_nft_address to get current state
      const positionGroups = new Map<string, any[]>()

      dbPositions?.forEach(tx => {
        if (tx.position_nft_address) {
          if (!positionGroups.has(tx.position_nft_address)) {
            positionGroups.set(tx.position_nft_address, [])
          }
          positionGroups.get(tx.position_nft_address)!.push(tx)
        }
      })

      // Process each position group
      for (const [nftAddress, txs] of positionGroups.entries()) {
        // Find the most recent position_open transaction
        const openTx = txs.find(t => t.tx_type === 'position_open')
        if (!openTx) continue

        // Check if position was closed
        const closeTx = txs.find(t => t.tx_type === 'position_close')
        if (closeTx) continue // Skip closed positions

        // Get latest fee claim
        const feeClaims = txs.filter(t => t.tx_type === 'fee_claim')
        const lastClaim = feeClaims.length > 0 
          ? feeClaims.sort((a, b) => b.block_time - a.block_time)[0]
          : null

        // Calculate current position value and unclaimed fees
        // This is a simplified version - in production, fetch from Meteora API
        const positionInfo = await this.fetchPositionDetails(nftAddress, openTx)

        if (positionInfo) {
          positions.push({
            position_nft_address: nftAddress,
            position_address: positionInfo.position_address,
            token_x_symbol: openTx.token_x_symbol || 'SOL',
            token_y_symbol: openTx.token_y_symbol || 'USDC',
            token_x_amount: positionInfo.token_x_amount,
            token_y_amount: positionInfo.token_y_amount,
            total_usd: positionInfo.total_usd,
            unclaimed_fees_usd: positionInfo.unclaimed_fees_usd,
            is_out_of_range: positionInfo.is_out_of_range,
            fee_apr_24h: positionInfo.fee_apr_24h,
            opened_at: new Date(openTx.block_time * 1000).toISOString(),
            last_claim_at: lastClaim ? new Date(lastClaim.block_time * 1000).toISOString() : null,
            last_rebalance_at: null // Would need to track rebalances
          })
        }
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
    }

    return positions
  }

  /**
   * Fetch position details from Meteora API
   */
  private async fetchPositionDetails(nftAddress: string, openTx: any): Promise<{
    position_address: string
    token_x_amount: number
    token_y_amount: number
    total_usd: number
    unclaimed_fees_usd: number
    is_out_of_range: boolean
    fee_apr_24h: number
  } | null> {
    try {
      // Try to get position details from Meteora API
      // This requires the pair address and owner wallet
      const pairAddress = openTx.position_data?.pair_address
      const ownerWallet = openTx.wallet_address

      if (!pairAddress || !ownerWallet) {
        return null
      }

      // Fetch from Meteora API
      const apiUrl = `https://dlmm-api.meteora.ag/pair/${pairAddress}/user/${ownerWallet}`
      const response = await fetch(apiUrl)

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      const userPositions = data.user_positions || []

      // Find the position matching our NFT address
      const position = userPositions.find((p: any) => 
        p.position_address === nftAddress || 
        p.public_key === nftAddress
      )

      if (!position) {
        return null
      }

      const posData = position.position_data || {}
      const tokenXDecimals = posData.token_x_decimals || 9
      const tokenYDecimals = posData.token_y_decimals || 6
      const tokenXPrice = posData.current_price || 190 // SOL price estimate

      const tokenXAmount = Number(posData.total_x_amount || 0) / Math.pow(10, tokenXDecimals)
      const tokenYAmount = Number(posData.total_y_amount || 0) / Math.pow(10, tokenYDecimals)
      const unclaimedFeeX = Number(posData.fee_x || 0) / Math.pow(10, tokenXDecimals)
      const unclaimedFeeY = Number(posData.fee_y || 0) / Math.pow(10, tokenYDecimals)

      const totalUSD = (tokenXAmount * tokenXPrice) + (tokenYAmount * 1) // USDC = $1
      const unclaimedFeesUSD = (unclaimedFeeX * tokenXPrice) + (unclaimedFeeY * 1)
      const isOutOfRange = posData.fee_apr_24h === 0 || posData.fee_apr_24h === null
      const feeApr24h = posData.fee_apr_24h || 0

      return {
        position_address: position.position_address || nftAddress,
        token_x_amount: tokenXAmount,
        token_y_amount: tokenYAmount,
        total_usd: totalUSD,
        unclaimed_fees_usd: unclaimedFeesUSD,
        is_out_of_range: isOutOfRange,
        fee_apr_24h: feeApr24h
      }
    } catch (error) {
      console.error('Error fetching position details:', error)
      return null
    }
  }
}


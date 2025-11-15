/**
 * Base Protocol Interface
 * All protocol implementations must extend this
 */

import { Connection } from '@solana/web3.js'
import { Position, TransactionResult, ClaimFeesParams, RebalanceParams, OpenPositionParams } from '../types'

export abstract class BaseProtocol {
  protected connection: Connection
  protected protocolName: string

  constructor(connection: Connection, protocolName: string) {
    this.connection = connection
    this.protocolName = protocolName
  }

  /**
   * Get all active positions for a wallet
   */
  abstract getPositions(walletAddress: string): Promise<Position[]>

  /**
   * Build transaction to claim fees
   */
  abstract buildClaimFeesTransaction(params: ClaimFeesParams): Promise<TransactionResult>

  /**
   * Build transaction to rebalance position
   */
  abstract buildRebalanceTransaction(params: RebalanceParams): Promise<TransactionResult>

  /**
   * Build transaction to open new position
   */
  abstract buildOpenPositionTransaction(params: OpenPositionParams): Promise<TransactionResult>

  /**
   * Get protocol name
   */
  getName(): string {
    return this.protocolName
  }
}


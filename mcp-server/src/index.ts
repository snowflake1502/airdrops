/**
 * Crypto Protocol MCP Server
 * Entry point for the MCP server
 */

import { CryptoProtocolMCPServer } from './server.js'

// Get RPC URL from environment or use default
const rpcUrl = process.env.SOLANA_RPC_URL || 
               process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
               'https://api.mainnet-beta.solana.com'

// Create and start server
const server = new CryptoProtocolMCPServer(rpcUrl)
server.start().catch((error) => {
  console.error('Failed to start MCP server:', error)
  process.exit(1)
})


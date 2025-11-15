# MCP Server Usage Examples

## Basic Usage

### 1. Start the MCP Server

```bash
cd mcp-server
npm install
npm run build
npm start
```

### 2. Use in Your Dashboard

```typescript
import { getMCPClient } from '@/lib/mcp-client'

// Get positions
const client = await getMCPClient()
const positions = await client.getPositions({
  protocol: 'meteora',
  walletAddress: 'YourWalletAddress...'
})

// Claim fees
const claimResult = await client.claimFees({
  protocol: 'meteora',
  positionNftAddress: 'PositionNFTAddress...',
  walletAddress: 'YourWalletAddress...'
})

if (claimResult.success && claimResult.transaction) {
  // Sign and send transaction
  const transaction = Transaction.from(Buffer.from(claimResult.transaction, 'base64'))
  const signed = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
}
```

## Integration with Automation Engine

Update `src/lib/automation/transaction-builder.ts`:

```typescript
import { getMCPClient } from '@/lib/mcp-client'

export class TransactionBuilder {
  private mcpClient: MCPClient | null = null

  async buildClaimFeesTransaction(params: BuildTransactionParams): Promise<Transaction> {
    const client = await getMCPClient()
    const result = await client.claimFees({
      protocol: 'meteora',
      positionNftAddress: params.positionNftAddress!,
      walletAddress: params.walletAddress,
    })

    if (!result.success || !result.transaction) {
      throw new Error(result.error || 'Failed to build transaction')
    }

    return Transaction.from(Buffer.from(result.transaction, 'base64'))
  }
}
```

## Testing with MCP Inspector

You can test the MCP server using MCP Inspector or any MCP-compatible client.

## Environment Setup

```bash
# Set RPC URL
export SOLANA_RPC_URL=https://your-rpc-url.com

# Or in .env file
SOLANA_RPC_URL=https://your-rpc-url.com
```


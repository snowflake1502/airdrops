# Crypto Protocol MCP Server

MCP (Model Context Protocol) server for crypto protocol integrations on Solana. Provides standardized tools and resources for interacting with DeFi protocols like Meteora, Jupiter, and Sanctum.

## 🎯 Features

- **Protocol Integrations**: Meteora, Jupiter, Sanctum (and more)
- **Transaction Building**: Claim fees, rebalance positions, open positions
- **Position Management**: Query active positions across protocols
- **MCP Standard**: Compatible with MCP clients and AI assistants

## 📦 Installation

```bash
npm install
```

## 🚀 Usage

### As MCP Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Environment Variables

```bash
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# or
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-url.com
```

## 🛠️ Available Tools

### `claim_fees`
Build transaction to claim unclaimed fees from a liquidity position.

**Parameters:**
- `protocol`: 'meteora' | 'jupiter' | 'sanctum'
- `positionNftAddress`: string
- `walletAddress`: string

**Returns:**
```json
{
  "success": true,
  "transaction": "base64-encoded-transaction",
  "error": null
}
```

### `rebalance_position`
Build transaction to rebalance an out-of-range liquidity position.

**Parameters:**
- `protocol`: 'meteora' | 'jupiter' | 'sanctum'
- `positionNftAddress`: string
- `positionAddress`: string
- `walletAddress`: string

### `open_position`
Build transaction to open a new liquidity position.

**Parameters:**
- `protocol`: 'meteora' | 'jupiter' | 'sanctum'
- `poolAddress`: string
- `walletAddress`: string
- `amountTokenX`: number
- `amountTokenY`: number
- `tokenXMint`: string
- `tokenYMint`: string

### `get_positions`
Get all active positions for a wallet.

**Parameters:**
- `protocol`: 'meteora' | 'jupiter' | 'sanctum' | 'all'
- `walletAddress`: string

## 📚 Resources

- `protocol://meteora/positions` - Get Meteora positions
- `protocol://meteora/pools` - Get available Meteora pools

## 🔌 Integration with Dashboard

See `../src/lib/mcp-client.ts` for the MCP client wrapper that can be used in your Next.js dashboard.

## 🏗️ Architecture

```
mcp-server/
├── src/
│   ├── protocols/        # Protocol implementations
│   │   ├── base-protocol.ts
│   │   ├── meteora.ts
│   │   └── index.ts
│   ├── server.ts         # MCP server setup
│   ├── types.ts         # Shared types
│   └── index.ts         # Entry point
└── package.json
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Run tests (when implemented)
npm test
```

## 📝 TODO

- [ ] Integrate Meteora SDK (@meteora-ag/dlmm)
- [ ] Add Jupiter protocol implementation
- [ ] Add Sanctum protocol implementation
- [ ] Implement resource reading
- [ ] Add error handling and retry logic
- [ ] Add authentication/authorization
- [ ] Add rate limiting
- [ ] Add monitoring and logging
- [ ] Write comprehensive tests

## 📄 License

MIT


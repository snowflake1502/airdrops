# Quick Start: MCP Server Integration

## 🚀 Setup Steps

### 1. Install MCP SDK in Dashboard

```bash
npm install @modelcontextprotocol/sdk
```

### 2. Setup MCP Server

```bash
cd mcp-server

# Windows
.\setup.ps1

# Mac/Linux
chmod +x setup.sh
./setup.sh

# Or manually:
npm install
npm run build
```

### 3. Install Meteora SDK (Optional - for full functionality)

```bash
cd mcp-server
npm install @meteora-ag/dlmm
npm run build
```

### 4. Start MCP Server

In one terminal:
```bash
cd mcp-server
npm start
```

### 5. Start Dashboard

In another terminal:
```bash
npm run dev
```

## ✅ Verification

1. **Check MCP Server is Running**
   - You should see: "Crypto Protocol MCP Server started" in the MCP server terminal

2. **Test from Dashboard**
   - Go to Activities → Automation Activity tab
   - Click "Execute" on a pending action
   - Check console for MCP communication

## 🔧 Configuration

### Environment Variables

Set in `.env.local`:
```bash
SOLANA_RPC_URL=https://your-rpc-url.com
```

The MCP server will use this RPC URL.

### MCP Server Path

The client connects to the server at:
- Path: `mcp-server/dist/index.js`
- Command: `node`

To customize, edit `src/lib/mcp-client.ts`:
```typescript
await mcpClient.connect('node', ['/custom/path/to/server.js'])
```

## 📝 Current Status

✅ **Completed:**
- MCP server structure
- Protocol abstraction layer
- MCP client wrapper
- Transaction builder integration
- Error handling

⏳ **Pending:**
- Meteora SDK integration (install @meteora-ag/dlmm)
- Actual SDK implementation in meteora.ts
- End-to-end testing

## 🐛 Troubleshooting

### "MCP client not connected"
- Ensure MCP server is running (`cd mcp-server && npm start`)
- Check that `mcp-server/dist/index.js` exists (run `npm run build`)

### "Meteora SDK not installed"
- Install: `cd mcp-server && npm install @meteora-ag/dlmm`
- Rebuild: `npm run build`

### Transaction building fails
- Check MCP server logs
- Verify RPC URL is set correctly
- Check that protocol SDK is integrated

## 🎯 Next Steps

1. **Complete Meteora SDK Integration**
   - Install `@meteora-ag/dlmm`
   - Update `mcp-server/src/protocols/meteora.ts` with actual SDK calls
   - Test with real positions

2. **Test End-to-End**
   - Create a test position
   - Try claiming fees
   - Verify transaction is built correctly

3. **Add More Protocols**
   - Jupiter
   - Sanctum
   - Others as needed


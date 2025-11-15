# MCP Server Integration Guide

## Quick Start

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Install Meteora SDK (Optional - for full functionality)

```bash
npm install @meteora-ag/dlmm
```

### 3. Build the Server

```bash
npm run build
```

### 4. Start the Server

```bash
npm start
```

## Integration with Dashboard

### Option 1: Use MCP Client (Recommended)

The dashboard already has an MCP client wrapper at `src/lib/mcp-client.ts`. The transaction builder (`src/lib/automation/transaction-builder.ts`) has been updated to use it.

**How it works:**
1. Transaction builder calls MCP client
2. MCP client communicates with MCP server via stdio
3. MCP server uses protocol SDKs to build transactions
4. Transaction is returned as base64, deserialized, and signed

### Option 2: Direct API Calls (Future)

For production, you might want to run the MCP server as a separate service and use HTTP/WebSocket transport instead of stdio.

## Configuration

### Environment Variables

Set in your `.env.local` or environment:

```bash
SOLANA_RPC_URL=https://your-rpc-url.com
```

Or the MCP server will use the default public RPC.

### MCP Server Path

The MCP client connects to the server using:
- Command: `node`
- Args: `['dist/index.js']`
- Working directory: `mcp-server/`

To customize, update `src/lib/mcp-client.ts`:

```typescript
await mcpClient.connect('node', ['/path/to/mcp-server/dist/index.js'])
```

## Testing

### Test MCP Server Directly

```bash
cd mcp-server
npm run dev
```

### Test from Dashboard

1. Start MCP server: `cd mcp-server && npm start`
2. Start dashboard: `npm run dev`
3. Try executing an automation action
4. Check console for MCP communication logs

## Troubleshooting

### "MCP client not connected"

- Ensure MCP server is running
- Check that `mcp-server/dist/index.js` exists (run `npm run build`)
- Verify RPC URL is set correctly

### "Meteora SDK not installed"

- Install: `cd mcp-server && npm install @meteora-ag/dlmm`
- Rebuild: `npm run build`

### Transaction building fails

- Check MCP server logs
- Verify protocol SDK is correctly integrated
- Check RPC connection

## Next Steps

1. **Complete Meteora SDK Integration**
   - Update `mcp-server/src/protocols/meteora.ts` with actual SDK calls
   - Test with real positions

2. **Add More Protocols**
   - Create `jupiter.ts` in `mcp-server/src/protocols/`
   - Register in `protocols/index.ts`

3. **Production Deployment**
   - Consider HTTP/WebSocket transport for MCP server
   - Add authentication
   - Add monitoring and logging

4. **Standalone Product**
   - Package as npm module
   - Add API documentation
   - Create developer portal


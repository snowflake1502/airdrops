# PowerShell setup script for MCP Server

Write-Host "🚀 Setting up MCP Server..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the server
Write-Host "🔨 Building MCP server..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build MCP server" -ForegroundColor Red
    exit 1
}

Write-Host "✅ MCP Server setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server, run:" -ForegroundColor Cyan
Write-Host "  npm start"
Write-Host ""
Write-Host "To install Meteora SDK (optional), run:" -ForegroundColor Cyan
Write-Host "  npm install @meteora-ag/dlmm"


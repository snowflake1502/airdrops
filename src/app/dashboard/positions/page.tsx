'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useWallet } from '@solana/wallet-adapter-react'
import DashboardLayout from '@/components/DashboardLayout'
import { positionTracker, ProtocolPosition, TokenPosition } from '@/lib/positionTracker'

export default function PositionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingPositions, setLoadingPositions] = useState(false)
  const [solBalance, setSolBalance] = useState(0)
  const [tokens, setTokens] = useState<TokenPosition[]>([])
  const [protocolPositions, setProtocolPositions] = useState<ProtocolPosition[]>([])
  const router = useRouter()
  const { publicKey, connected } = useWallet()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [router])

  // Fetch positions when wallet is connected
  useEffect(() => {
    const fetchPositions = async () => {
      if (!connected || !publicKey) {
        setSolBalance(0)
        setTokens([])
        setProtocolPositions([])
        return
      }

      setLoadingPositions(true)
      try {
        const positions = await positionTracker.getAllPositions(publicKey.toBase58())
        setSolBalance(positions.solBalance)
        setTokens(positions.tokens)
        setProtocolPositions(positions.protocolPositions)
      } catch (error) {
        console.error('Error fetching positions:', error)
      } finally {
        setLoadingPositions(false)
      }
    }

    fetchPositions()
  }, [connected, publicKey])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Positions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor your liquidity, staking, and farming positions across Solana
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-3xl font-bold mb-2">Coming Soon</h2>
            <p className="text-lg mb-6">
              Position Monitoring - Track all your DeFi positions in real-time
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Planned Features:</h3>
              <ul className="text-left space-y-2">
                <li>✓ Connect Solana wallet (Phantom, Solflare)</li>
                <li>✓ Track liquidity pool positions (Meteora, Jupiter)</li>
                <li>✓ Monitor staking positions (Sanctum LSTs)</li>
                <li>✓ View farming rewards and yields</li>
                <li>✓ Real-time position values and PnL</li>
                <li>✓ Transaction history for each protocol</li>
                <li>✓ Airdrop eligibility calculator based on positions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">SOL Balance</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">
              {loadingPositions ? '...' : solBalance.toFixed(4)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {connected ? 'SOL' : 'Connect wallet'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Token Holdings</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {loadingPositions ? '...' : tokens.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Different tokens</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Protocol Positions</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {loadingPositions ? '...' : protocolPositions.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Active positions</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Airdrop Score</div>
            <div className="text-3xl font-bold text-indigo-600 mt-2">
              {connected ? Math.min(95, protocolPositions.length * 25) : '-'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Based on activity</div>
          </div>
        </div>

        {/* Wallet Connection Prompt or Positions */}
        {!connected ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👛</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-4">
                Connect your Solana wallet to start tracking positions
              </p>
              <p className="text-sm text-gray-500">
                Click the "Select Wallet" button in the top right corner
              </p>
            </div>
          </div>
        ) : loadingPositions ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your positions...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Protocol Positions */}
            {protocolPositions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Protocol Positions</h2>
                <div className="space-y-3">
                  {protocolPositions.map((position, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{position.protocol}</h3>
                          <p className="text-sm text-gray-600 capitalize">{position.positionType}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{position.value.toFixed(4)}</div>
                          <div className="text-sm text-gray-500">tokens</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Token Holdings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All Token Holdings ({tokens.length})
              </h2>
              {tokens.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tokens found in this wallet</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {tokens.map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-gray-600 truncate">
                          {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{token.uiAmount.toFixed(4)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}


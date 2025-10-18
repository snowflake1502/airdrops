'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your farming performance and airdrop probabilities
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-3xl font-bold mb-2">Coming Soon</h2>
            <p className="text-lg mb-6">
              Advanced Analytics - Data-driven insights for your airdrop farming
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Planned Features:</h3>
              <ul className="text-left space-y-2">
                <li>✓ Activity consistency tracking and streaks</li>
                <li>✓ Airdrop probability calculator per protocol</li>
                <li>✓ ROI projections based on historical data</li>
                <li>✓ Protocol comparison and optimization suggestions</li>
                <li>✓ Gas fees tracking (Solana's ultra-low fees)</li>
                <li>✓ Time investment vs expected returns analysis</li>
                <li>✓ Monthly performance reports</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Analytics Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Chart Placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-500">Activity chart coming soon</p>
              </div>
            </div>
          </div>

          {/* Airdrop Probability */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Airdrop Probability</h3>
            <div className="space-y-4">
              {[
                { name: 'Meteora', probability: 95, color: 'green' },
                { name: 'Jupiter', probability: 85, color: 'blue' },
                { name: 'Sanctum', probability: 75, color: 'purple' },
                { name: 'Magic Eden', probability: 60, color: 'yellow' }
              ].map((protocol) => (
                <div key={protocol.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{protocol.name}</span>
                    <span className="text-sm text-gray-600">{protocol.probability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${protocol.color}-600 h-2 rounded-full`}
                      style={{ width: `${protocol.probability}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Gas Fees (Solana)</span>
                <span className="font-semibold text-green-600">~$20-50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Capital Deployed</span>
                <span className="font-semibold">$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Airdrop Value</span>
                <span className="font-semibold text-indigo-600">$5K-25K</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">Projected ROI</span>
                  <span className="font-bold text-green-600">10,000%+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">0</div>
                <div className="text-sm text-blue-800">Activities Completed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">0%</div>
                <div className="text-sm text-green-800">Consistency Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-800">Protocols Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


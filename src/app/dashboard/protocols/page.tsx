'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'

export default function ProtocolsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Protocol Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage Solana DeFi protocols for airdrop farming
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-3xl font-bold mb-2">Coming Soon</h2>
            <p className="text-lg mb-6">
              Protocol Management System - Track all Solana airdrop opportunities
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Planned Features:</h3>
              <ul className="text-left space-y-2">
                <li>✓ View all Solana protocols (Meteora, Jupiter, Sanctum, Magic Eden)</li>
                <li>✓ Add custom protocols to track</li>
                <li>✓ Categorize by airdrop potential (Confirmed, High, Medium, Low)</li>
                <li>✓ Track protocol details (website, Twitter, Discord links)</li>
                <li>✓ View protocol activity requirements</li>
                <li>✓ Get notifications for new airdrop announcements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Protocols Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracked Protocols (Preview)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Meteora', status: 'Confirmed', color: 'green' },
              { name: 'Jupiter', status: 'High Potential', color: 'blue' },
              { name: 'Sanctum', status: 'High Potential', color: 'blue' },
              { name: 'Magic Eden', status: 'Medium Potential', color: 'yellow' }
            ].map((protocol) => (
              <div key={protocol.name} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">{protocol.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{protocol.name}</h3>
                    <p className="text-sm text-gray-500">Solana Ecosystem</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${protocol.color}-100 text-${protocol.color}-800`}>
                  {protocol.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


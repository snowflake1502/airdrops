'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'

export default function PlansPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">My Airdrop Plans</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage your monthly airdrop farming strategies
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-3xl font-bold mb-2">Coming Soon</h2>
            <p className="text-lg mb-6">
              Airdrop Plan Builder - Create custom monthly farming strategies
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Planned Features:</h3>
              <ul className="text-left space-y-2">
                <li>✓ Create monthly farming plans starting with October 2025</li>
                <li>✓ Customize activities for each protocol (Meteora, Jupiter, etc.)</li>
                <li>✓ Set goals and track progress</li>
                <li>✓ Allocate budget across different protocols</li>
                <li>✓ View expected returns and ROI</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Active Plans</div>
            <div className="text-3xl font-bold text-indigo-600 mt-2">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Completed Plans</div>
            <div className="text-3xl font-bold text-green-600 mt-2">0</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Protocols</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">4</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


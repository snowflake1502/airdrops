'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'
import AirdropOverview from '@/components/AirdropOverview'

export default function DashboardPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's your airdrop farming dashboard overview
          </p>
        </div>

        <AirdropOverview />

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 transition-colors">
              Create New Airdrop Plan
            </button>
            <button className="bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors">
              Add Protocol to Track
            </button>
            <button className="bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 transition-colors">
              View Activity Checklist
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center text-gray-500 py-8">
            <p>No recent activity yet.</p>
            <p className="text-sm mt-2">Start by creating your first airdrop plan!</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


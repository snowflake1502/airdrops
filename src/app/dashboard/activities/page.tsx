'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'

export default function ActivitiesPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Daily Activities</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your daily airdrop farming tasks and maintain consistency
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-2">Coming Soon</h2>
            <p className="text-lg mb-6">
              Daily Activity Checklist - Stay consistent with your farming routine
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Planned Features:</h3>
              <ul className="text-left space-y-2">
                <li>✓ Daily task checklists for each protocol</li>
                <li>✓ Monday: Jupiter trading activities</li>
                <li>✓ Tuesday: Meteora liquidity campaigns</li>
                <li>✓ Wednesday: Sanctum liquid staking</li>
                <li>✓ Thursday: Magic Eden NFT activities</li>
                <li>✓ Track completion streaks and consistency</li>
                <li>✓ Set reminders for important activities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity Schedule (Preview)</h2>
          <div className="space-y-3">
            {[
              { day: 'Monday', focus: 'Jupiter Ecosystem', tasks: '3-5 trades, stake JUP' },
              { day: 'Tuesday', focus: 'Meteora Liquidity', tasks: 'Manage liquidity positions' },
              { day: 'Wednesday', focus: 'Sanctum Staking', tasks: 'Liquid staking optimization' },
              { day: 'Thursday', focus: 'NFT & Culture', tasks: 'Magic Eden trading' },
              { day: 'Friday', focus: 'Ecosystem Exploration', tasks: 'Discover new protocols' }
            ].map((schedule) => (
              <div key={schedule.day} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{schedule.day}</h3>
                    <p className="text-sm text-gray-600">{schedule.focus}</p>
                  </div>
                  <span className="text-sm text-gray-500">{schedule.tasks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


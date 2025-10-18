'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import DashboardLayout from '@/components/DashboardLayout'

export default function SettingsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <input
                type="text"
                value={new Date(user?.created_at || '').toLocaleDateString()}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-3xl font-bold mb-2">Additional Settings Coming Soon</h2>
            <p className="text-lg mb-6">
              More customization options will be available soon
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2">Planned Features:</h3>
              <ul className="text-left space-y-2">
                <li>✓ Notification preferences (email, push, Discord)</li>
                <li>✓ Wallet management and connection</li>
                <li>✓ Privacy settings</li>
                <li>✓ Data export and backup</li>
                <li>✓ API key management</li>
                <li>✓ Theme customization (light/dark mode)</li>
                <li>✓ Two-factor authentication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-500">Update your account password</div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Manage Wallets</div>
              <div className="text-sm text-gray-500">Connect or disconnect Solana wallets</div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Export Data</div>
              <div className="text-sm text-gray-500">Download your airdrop farming data</div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
              <div className="font-medium">Delete Account</div>
              <div className="text-sm text-red-500">Permanently delete your account and data</div>
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            Contact our support team or check out the documentation for help with airdrop farming strategies.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}


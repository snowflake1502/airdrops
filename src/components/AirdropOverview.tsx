'use client'

import { useState, useEffect } from 'react'

interface Protocol {
  id: string
  name: string
  airdrop_potential: 'high' | 'medium' | 'low' | 'confirmed'
  status: 'active' | 'inactive' | 'upcoming'
}

export default function AirdropOverview() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProtocols = async () => {
      const mockProtocols: Protocol[] = [
        { id: '1', name: 'Meteora', airdrop_potential: 'confirmed', status: 'active' },
        { id: '2', name: 'Jupiter', airdrop_potential: 'high', status: 'active' },
        { id: '3', name: 'Sanctum', airdrop_potential: 'high', status: 'active' },
        { id: '4', name: 'Magic Eden', airdrop_potential: 'medium', status: 'active' }
      ]

      setTimeout(() => {
        setProtocols(mockProtocols)
        setLoading(false)
      }, 500)
    }

    loadProtocols()
  }, [])

  const getAirdropBadgeColor = (potential: string) => {
    switch (potential) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'high': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Airdrop Overview</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Airdrop Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">4</div>
          <div className="text-sm text-green-800">Active Protocols</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">2</div>
          <div className="text-sm text-blue-800">High Potential</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">1</div>
          <div className="text-sm text-yellow-800">Medium Potential</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">1</div>
          <div className="text-sm text-purple-800">Confirmed</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-900">Top Protocols</h3>
        {protocols.map((protocol) => (
          <div key={protocol.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">{protocol.name.charAt(0)}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{protocol.name}</h4>
                <p className="text-sm text-gray-500 capitalize">{protocol.status}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAirdropBadgeColor(protocol.airdrop_potential)}`}>
              {protocol.airdrop_potential}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


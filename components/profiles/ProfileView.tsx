'use client'

import { useState, useEffect } from 'react'
import { SignalSelector } from '@/components/signals/SignalSelector'
import type { SignalCategory, UserSignalWithDetails } from '@/types/signals'
import { getDaysUntilExpiration } from '@/types/signals'

interface ProfileViewProps {
  userId: string
  categories: SignalCategory[]
  signalsByCategory: Record<string, any[]>
  userSignals: UserSignalWithDetails[]
  userEmail?: string
  userFullName?: string
  memberSince?: string
}

export function ProfileView({
  userId,
  categories,
  signalsByCategory,
  userSignals,
  userEmail,
  userFullName,
  memberSince,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [connectionStats, setConnectionStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
  })

  useEffect(() => {
    // Fetch connection stats
    async function fetchStats() {
      try {
        const response = await fetch('/api/connections')
        if (response.ok) {
          const connections = await response.json()
          const accepted = connections.filter((c: any) => c.status === 'accepted').length
          const pending = connections.filter(
            (c: any) => c.status === 'pending' && c.receiver_id === userId
          ).length
          const sent = connections.filter(
            (c: any) => c.status === 'pending' && c.requester_id === userId
          ).length
          setConnectionStats({ total: accepted, pending, sent })
        }
      } catch (error) {
        console.error('Error fetching connection stats:', error)
      }
    }
    fetchStats()
  }, [userId])

  // Group user signals by category
  const signalsByCategory2 = userSignals.reduce((acc, us) => {
    const categoryName = us.signal.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(us)
    return acc
  }, {} as Record<string, UserSignalWithDetails[]>)

  // Helper to get color for expiration
  const getExpirationColor = (daysLeft: number | null) => {
    if (daysLeft === null) return 'text-gray-500'
    if (daysLeft < 7) return 'text-red-600'
    if (daysLeft < 30) return 'text-yellow-600'
    return 'text-gray-500'
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Edit your signals</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Done editing
          </button>
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const signals = signalsByCategory[category.id] || []

            return (
              <div key={category.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <SignalSelector
                  userId={userId}
                  categoryId={category.id}
                  categoryName={category.name}
                  signals={signals}
                  userSignals={userSignals}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">
              {userFullName || 'Your Profile'}
            </h1>
            {userEmail && (
              <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
            )}
            {memberSince && (
              <p className="text-xs text-gray-500 mt-2">Member since {memberSince}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Connection Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{connectionStats.total}</div>
                <div className="text-xs text-gray-600">Connections</div>
              </div>
              {connectionStats.pending > 0 && (
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{connectionStats.pending}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              )}
              {connectionStats.sent > 0 && (
                <div className="text-center">
                  <div className="font-semibold text-yellow-600">{connectionStats.sent}</div>
                  <div className="text-xs text-gray-600">Sent</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signals Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Your signals</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Edit signals
          </button>
        </div>

        {userSignals.length > 0 ? (
          <div className="space-y-5">
            {Object.entries(signalsByCategory2).map(([categoryName, signals]) => (
              <div key={categoryName}>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  {categoryName}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {signals.map((userSignal) => {
                    const daysLeft = getDaysUntilExpiration(userSignal)
                    const expirationColor = getExpirationColor(daysLeft)

                    return (
                      <div
                        key={userSignal.id}
                        className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
                        title={userSignal.signal.description || undefined}
                      >
                        <span>{userSignal.signal.label}</span>
                        {daysLeft !== null && (
                          <span className={`flex items-center gap-1 text-xs ${expirationColor.replace('text-', 'text-white/')}`}>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className={daysLeft < 7 ? 'text-red-300' : daysLeft < 30 ? 'text-yellow-300' : 'text-white/70'}>
                              {daysLeft}d
                            </span>
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-1 font-medium">No signals selected yet</p>
            <p className="text-sm text-gray-500 mb-6">
              Add signals to let others know what you&apos;re up to
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Add your first signal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

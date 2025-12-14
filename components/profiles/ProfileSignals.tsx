'use client'

import { useState } from 'react'
import { SignalSelector } from '@/components/signals/SignalSelector'
import type { SignalCategory, UserSignalWithDetails } from '@/types/signals'
import { getDaysUntilExpiration } from '@/types/signals'

interface ProfileSignalsProps {
  userId: string
  categories: SignalCategory[]
  signalsByCategory: Record<string, any[]>
  userSignals: UserSignalWithDetails[]
}

export function ProfileSignals({
  userId,
  categories,
  signalsByCategory,
  userSignals,
}: ProfileSignalsProps) {
  const [isEditing, setIsEditing] = useState(false)

  // Group user signals by category
  const userSignalsByCategory = userSignals.reduce((acc, us) => {
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
            {Object.entries(userSignalsByCategory).map(([categoryName, signals]) => (
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

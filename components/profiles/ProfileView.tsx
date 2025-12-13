'use client'

import { useState } from 'react'
import { SignalSelector } from '@/components/signals/SignalSelector'
import type { SignalCategory, UserSignalWithDetails } from '@/types/signals'
import { getDaysUntilExpiration } from '@/types/signals'

interface ProfileViewProps {
  userId: string
  categories: SignalCategory[]
  signalsByCategory: Record<string, any[]>
  userSignals: UserSignalWithDetails[]
}

export function ProfileView({
  userId,
  categories,
  signalsByCategory,
  userSignals,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)

  // Group user signals by category
  const signalsByCategory2 = userSignals.reduce((acc, us) => {
    const categoryName = us.signal.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(us)
    return acc
  }, {} as Record<string, UserSignalWithDetails[]>)

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Edit your signals</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Done editing
          </button>
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const signals = signalsByCategory[category.id] || []

            return (
              <div key={category.id} className="bg-white rounded-lg p-6 shadow-sm">
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Your signals</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Edit signals
        </button>
      </div>

      {userSignals.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(signalsByCategory2).map(([categoryName, signals]) => (
            <div key={categoryName} className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                {categoryName}
              </h3>
              <div className="space-y-2">
                {signals.map((userSignal) => {
                  const daysLeft = getDaysUntilExpiration(userSignal)
                  return (
                    <div
                      key={userSignal.id}
                      className="flex items-start justify-between py-2"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {userSignal.signal.label}
                        </div>
                        {userSignal.signal.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {userSignal.signal.description}
                          </div>
                        )}
                      </div>
                      {daysLeft !== null && (
                        <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                          {daysLeft}d left
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 shadow-sm text-center">
          <p className="text-gray-600 mb-4">No signals selected yet</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            Add your first signal
          </button>
        </div>
      )}
    </div>
  )
}

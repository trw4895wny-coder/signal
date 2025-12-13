'use client'

import { useState, useTransition } from 'react'
import { toggleSignal } from '@/app/profile/actions'
import { canAddSignal, getDaysUntilExpiration, CONSTRAINTS } from '@/types/signals'
import type { Signal, UserSignalWithDetails } from '@/types/signals'

interface SignalSelectorProps {
  userId: string
  categoryId: string
  categoryName: string
  signals: Signal[]
  userSignals: UserSignalWithDetails[]
}

export function SignalSelector({
  userId,
  categoryId,
  categoryName,
  signals,
  userSignals,
}: SignalSelectorProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const userSignalIds = new Set(userSignals.map((us) => us.signal_id))
  const totalSelected = userSignals.length

  const handleToggle = (signal: Signal, isSelected: boolean) => {
    setError(null)

    if (!isSelected) {
      // Check if we can add this signal
      const validation = canAddSignal(userSignals, signal)
      if (!validation.allowed) {
        setError(validation.reason || 'Cannot add signal')
        return
      }
    }

    startTransition(async () => {
      const result = await toggleSignal(userId, signal.id, isSelected)
      if (result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{categoryName}</h3>
        <span className="text-sm text-gray-500">
          {userSignals.filter((us) => us.signal.category_id === categoryId).length} selected
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {signals.map((signal) => {
          const isSelected = userSignalIds.has(signal.id)
          const userSignal = userSignals.find((us) => us.signal_id === signal.id)
          const daysUntilExpiration = userSignal
            ? getDaysUntilExpiration(userSignal)
            : null

          return (
            <button
              key={signal.id}
              onClick={() => handleToggle(signal, isSelected)}
              disabled={isPending}
              className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${
                isSelected
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              } ${isPending ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{signal.label}</div>
                  {signal.description && (
                    <div
                      className={`text-sm mt-1 ${
                        isSelected ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {signal.description}
                    </div>
                  )}
                </div>
                {daysUntilExpiration !== null && (
                  <div
                    className={`text-xs ml-2 ${
                      isSelected ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {daysUntilExpiration}d left
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="text-xs text-gray-500 pt-2">
        {totalSelected}/{CONSTRAINTS.MAX_TOTAL_SIGNALS} total signals selected
      </div>
    </div>
  )
}

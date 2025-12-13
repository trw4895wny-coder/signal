'use client'

import { useState } from 'react'
import type { Signal, SignalCategory } from '@/types/signals'

interface SignalFilterProps {
  categories: SignalCategory[]
  signalsByCategory: Record<string, Signal[]>
  onFilterChange: (selectedSignalIds: string[]) => void
}

export function SignalFilter({
  categories,
  signalsByCategory,
  onFilterChange,
}: SignalFilterProps) {
  const [selectedSignals, setSelectedSignals] = useState<Set<string>>(new Set())

  const handleToggle = (signalId: string) => {
    const newSelected = new Set(selectedSignals)
    if (newSelected.has(signalId)) {
      newSelected.delete(signalId)
    } else {
      newSelected.add(signalId)
    }
    setSelectedSignals(newSelected)
    onFilterChange(Array.from(newSelected))
  }

  const clearAll = () => {
    setSelectedSignals(new Set())
    onFilterChange([])
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Filter by signals</h2>
        {selectedSignals.size > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const signals = signalsByCategory[category.id] || []
          const selectedInCategory = signals.filter((s) =>
            selectedSignals.has(s.id)
          ).length

          return (
            <div key={category.id}>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {category.name}
                {selectedInCategory > 0 && (
                  <span className="ml-2 text-gray-500">({selectedInCategory})</span>
                )}
              </h3>
              <div className="space-y-1">
                {signals.map((signal) => {
                  const isSelected = selectedSignals.has(signal.id)
                  return (
                    <button
                      key={signal.id}
                      onClick={() => handleToggle(signal.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        isSelected
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {signal.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selectedSignals.size > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Filtering by {selectedSignals.size} signal{selectedSignals.size !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}

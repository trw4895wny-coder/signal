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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['availability']) // Availability expanded by default
  )

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

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
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

      <div className="space-y-3">
        {categories.map((category) => {
          const signals = signalsByCategory[category.id] || []
          const selectedInCategory = signals.filter((s) =>
            selectedSignals.has(s.id)
          ).length
          const isExpanded = expandedCategories.has(category.id)

          return (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {category.name}
                  </h3>
                  {selectedInCategory > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-gray-900 text-white rounded-full">
                      {selectedInCategory}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-out ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{
                  overflow: 'hidden',
                }}
              >
                <div className="px-4 pb-3 space-y-1">
                  {signals.map((signal) => {
                    const isSelected = selectedSignals.has(signal.id)
                    return (
                      <button
                        key={signal.id}
                        onClick={() => handleToggle(signal.id)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-all duration-200 ${
                          isSelected
                            ? 'bg-gray-900 text-white scale-[1.02]'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-[1.01]'
                        }`}
                      >
                        {signal.label}
                      </button>
                    )
                  })}
                </div>
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

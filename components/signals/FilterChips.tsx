'use client'

import { useState, useRef, useEffect } from 'react'
import type { Signal, SignalCategory } from '@/types/signals'

interface FilterChipsProps {
  categories: SignalCategory[]
  signalsByCategory: Record<string, Signal[]>
  onFilterChange: (selectedSignalIds: string[]) => void
}

export function FilterChips({
  categories,
  signalsByCategory,
  onFilterChange,
}: FilterChipsProps) {
  const [selectedSignals, setSelectedSignals] = useState<Set<string>>(new Set())
  const [isAddingFilter, setIsAddingFilter] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAddingFilter(false)
        setHoveredCategory(null)
      }
    }

    if (isAddingFilter) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAddingFilter])

  const getSignalById = (signalId: string): Signal | undefined => {
    for (const signals of Object.values(signalsByCategory)) {
      const signal = signals.find((s) => s.id === signalId)
      if (signal) return signal
    }
  }

  const getCategoryById = (categoryId: string): SignalCategory | undefined => {
    return categories.find((c) => c.id === categoryId)
  }

  const handleAddSignal = (signalId: string) => {
    const newSelected = new Set(selectedSignals)
    newSelected.add(signalId)
    setSelectedSignals(newSelected)
    onFilterChange(Array.from(newSelected))
    setIsAddingFilter(false)
    setHoveredCategory(null)
  }

  const handleRemoveSignal = (signalId: string) => {
    const newSelected = new Set(selectedSignals)
    newSelected.delete(signalId)
    setSelectedSignals(newSelected)
    onFilterChange(Array.from(newSelected))
  }

  const clearAll = () => {
    setSelectedSignals(new Set())
    onFilterChange([])
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        {/* Selected filter chips */}
        {Array.from(selectedSignals).map((signalId) => {
          const signal = getSignalById(signalId)
          if (!signal) return null

          return (
            <button
              key={signalId}
              onClick={() => handleRemoveSignal(signalId)}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
            >
              <span>{signal.label}</span>
              <svg
                className="w-4 h-4 text-white/80 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )
        })}

        {/* Add filter button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsAddingFilter(!isAddingFilter)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-dashed text-sm font-medium transition-all ${
              isAddingFilter
                ? 'border-gray-900 bg-gray-50 text-gray-900'
                : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add filter</span>
          </button>

          {/* Filter menu - Cascading */}
          {isAddingFilter && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden flex">
              {/* Categories column */}
              <div className="py-2 min-w-[200px] border-r border-gray-100">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Select category
                </div>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                      hoveredCategory === category.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Signals column */}
              {hoveredCategory && (
                <div className="py-2 min-w-[240px] max-h-[400px] overflow-y-auto">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {getCategoryById(hoveredCategory)?.name}
                  </div>
                  {(signalsByCategory[hoveredCategory] || []).map((signal) => {
                    const isSelected = selectedSignals.has(signal.id)
                    return (
                      <button
                        key={signal.id}
                        onClick={() => handleAddSignal(signal.id)}
                        disabled={isSelected}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                            : 'text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isSelected && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {signal.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clear all button */}
        {selectedSignals.size > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors ml-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter count */}
      {selectedSignals.size > 0 && (
        <p className="text-sm text-gray-600 mt-3">
          Filtering by {selectedSignals.size} signal{selectedSignals.size !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

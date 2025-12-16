'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { toggleSignal } from '@/app/profile/actions'
import { canAddSignal } from '@/types/signals'
import type { Signal, SignalCategory, UserSignalWithDetails } from '@/types/signals'

interface SignalChipEditorProps {
  userId: string
  categories: SignalCategory[]
  signalsByCategory: Record<string, Signal[]>
  userSignals: UserSignalWithDetails[]
}

export function SignalChipEditor({
  userId,
  categories,
  signalsByCategory,
  userSignals,
}: SignalChipEditorProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isAddingSignal, setIsAddingSignal] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAddingSignal(false)
        setHoveredCategory(null)
      }
    }

    if (isAddingSignal) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAddingSignal])

  const userSignalIds = new Set(userSignals.map((us) => us.signal_id))

  // Calculate menu position when opening
  const updateMenuPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }
  }

  // Update position when opening menu
  useEffect(() => {
    if (isAddingSignal) {
      updateMenuPosition()
    }
  }, [isAddingSignal])

  const getSignalById = (signalId: string): Signal | undefined => {
    for (const signals of Object.values(signalsByCategory)) {
      const signal = signals.find((s) => s.id === signalId)
      if (signal) return signal
    }
  }

  const getCategoryById = (categoryId: string): SignalCategory | undefined => {
    return categories.find((c) => c.id === categoryId)
  }

  const handleToggleSignal = (signal: Signal, isSelected: boolean) => {
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
      } else {
        setIsAddingSignal(false)
        setHoveredCategory(null)
      }
    })
  }

  return (
    <div className="relative">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md mb-3">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Selected signal chips */}
        {userSignals.map((userSignal) => (
          <button
            key={userSignal.id}
            onClick={() => handleToggleSignal(userSignal.signal, true)}
            disabled={isPending}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <span>{userSignal.signal.label}</span>
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
        ))}

        {/* Add signal button */}
        <button
          ref={buttonRef}
          onClick={() => setIsAddingSignal(!isAddingSignal)}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-dashed text-sm font-medium transition-all disabled:opacity-50 ${
            isAddingSignal
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
          <span>Add signal</span>
        </button>
      </div>

      {/* Signal menu - Cascading (rendered at body level) */}
      {isAddingSignal && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[100] overflow-hidden flex"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
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
                    const isSelected = userSignalIds.has(signal.id)
                    return (
                      <button
                        key={signal.id}
                        onClick={() => handleToggleSignal(signal, isSelected)}
                        disabled={isSelected || isPending}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                            : 'text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0">
                            {isSelected && (
                              <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">{signal.label}</div>
                            {signal.description && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {signal.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
            </div>
          )}
        </div>
      )}

      {/* Signal count */}
      <p className="text-sm text-gray-500 mt-3">
        {userSignals.length} of 5 signals selected
      </p>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

export type SidebarMode = 'expanded' | 'collapsed' | 'hover'

interface SidebarSettingsProps {
  isOpen: boolean
  currentMode: SidebarMode
  onModeChange: (mode: SidebarMode) => void
  onClose: () => void
}

export function SidebarSettings({ isOpen, currentMode, onModeChange, onClose }: SidebarSettingsProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modes: { value: SidebarMode; label: string; description: string }[] = [
    {
      value: 'expanded',
      label: 'Expanded',
      description: 'Sidebar always shows labels',
    },
    {
      value: 'collapsed',
      label: 'Collapsed',
      description: 'Sidebar shows icons only',
    },
    {
      value: 'hover',
      label: 'Expand on hover',
      description: 'Expands when you hover over it',
    },
  ]

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-medium text-white">Sidebar control</h3>
      </div>

      {/* Options */}
      <div className="p-2 space-y-1">
        {modes.map((mode) => (
          <label
            key={mode.value}
            className={`
              flex items-start gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors group
              ${
                currentMode === mode.value
                  ? 'bg-gray-800'
                  : 'hover:bg-gray-800/50'
              }
            `}
          >
            {/* Custom radio button circle */}
            <div className="relative flex items-center justify-center w-4 h-4 mt-0.5">
              <div
                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  currentMode === mode.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-600 bg-transparent group-hover:border-gray-500'
                }`}
              >
                {currentMode === mode.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <input
                type="radio"
                name="sidebar-mode"
                value={mode.value}
                checked={currentMode === mode.value}
                onChange={() => onModeChange(mode.value)}
                className="sr-only"
              />
            </div>

            <div className="flex-1">
              <div
                className={`text-sm font-medium ${
                  currentMode === mode.value ? 'text-white' : 'text-gray-300'
                }`}
              >
                {mode.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {mode.description}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

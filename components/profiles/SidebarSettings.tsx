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

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Settings Panel */}
      <div
        ref={panelRef}
        className="relative bg-gray-900 rounded-lg shadow-2xl border border-gray-800 w-full max-w-sm mx-4 animate-in fade-in slide-in-from-top-4 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Sidebar control</h3>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2">
          {modes.map((mode) => (
            <label
              key={mode.value}
              className={`
                flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
                ${
                  currentMode === mode.value
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="sidebar-mode"
                value={mode.value}
                checked={currentMode === mode.value}
                onChange={() => onModeChange(mode.value)}
                className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="font-medium">{mode.label}</div>
                <div className="text-sm text-gray-500">{mode.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

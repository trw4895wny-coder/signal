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
    <>
      {/* Backdrop - subtle, only on mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-[60]"
          onClick={onClose}
        />
      )}

      {/* Settings Popover - positioned at bottom-left */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-20 left-4 md:left-4 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 w-64 z-[70] animate-in fade-in slide-in-from-bottom-2 duration-200"
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
                  flex items-start gap-2.5 p-2.5 rounded-md cursor-pointer transition-colors
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
                  className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-1"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{mode.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{mode.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

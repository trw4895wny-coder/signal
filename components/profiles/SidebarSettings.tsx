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
      className="absolute top-full right-0 mt-2 w-48 bg-black rounded-lg shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-800">
        <h3 className="text-xs font-medium text-white">Sidebar control</h3>
      </div>

      {/* Options */}
      <div className="p-1.5 space-y-0.5">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={`
              w-full text-left px-2.5 py-2 rounded-md cursor-pointer transition-colors
              ${
                currentMode === mode.value
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
              }
            `}
          >
            <div className="text-xs font-medium">
              {mode.label}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {mode.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

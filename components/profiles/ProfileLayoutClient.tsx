'use client'

import { useEffect, useState } from 'react'

type SidebarMode = 'expanded' | 'collapsed' | 'hover'

interface ProfileLayoutClientProps {
  children: React.ReactNode
}

export function ProfileLayoutClient({ children }: ProfileLayoutClientProps) {
  const [sidebarWidth, setSidebarWidth] = useState(240)

  useEffect(() => {
    // Sync with sidebar mode
    const updateWidth = () => {
      const mode = (localStorage.getItem('sidebar-mode') || 'expanded') as SidebarMode
      // For layout margin, collapsed and hover modes both use 64px
      // (hover expands on hover but the content area stays at 64px margin)
      const width = mode === 'expanded' ? 240 : 64
      setSidebarWidth(width)
    }

    // Initial check
    updateWidth()

    // Listen for storage changes (when sidebar mode is changed)
    const handleStorageChange = () => {
      updateWidth()
    }

    window.addEventListener('storage', handleStorageChange)
    // Custom event for same-window updates
    window.addEventListener('sidebar-toggle', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-toggle', handleStorageChange)
    }
  }, [])

  return (
    <div
      className="transition-all duration-200 min-h-screen md:ml-[var(--sidebar-width)]"
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

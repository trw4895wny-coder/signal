'use client'

import { useEffect, useState } from 'react'

interface ProfileLayoutClientProps {
  children: React.ReactNode
}

export function ProfileLayoutClient({ children }: ProfileLayoutClientProps) {
  const [sidebarWidth, setSidebarWidth] = useState(240)

  useEffect(() => {
    // Sync with sidebar state
    const updateWidth = () => {
      const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true'
      const width = isCollapsed ? 64 : 240
      setSidebarWidth(width)
    }

    // Initial check
    updateWidth()

    // Listen for storage changes (when sidebar state is changed)
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

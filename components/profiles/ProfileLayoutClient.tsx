'use client'

import { useEffect, useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'

interface ProfileLayoutClientProps {
  children: React.ReactNode
  mobileMenuButton?: React.ReactNode
}

export function ProfileLayoutClient({ children, mobileMenuButton }: ProfileLayoutClientProps) {
  const [sidebarWidth, setSidebarWidth] = useState(240)

  useEffect(() => {
    // Sync with sidebar collapse state
    const updateWidth = () => {
      const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true'
      setSidebarWidth(isCollapsed ? 64 : 240)
    }

    // Initial check
    updateWidth()

    // Listen for storage changes (when sidebar is toggled)
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
      className="transition-all duration-300 min-h-screen md:ml-[var(--sidebar-width)]"
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

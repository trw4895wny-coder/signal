'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProfileTabsProps {
  userId: string
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const pathname = usePathname()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    // Fetch pending connection requests count
    async function fetchPendingCount() {
      try {
        const response = await fetch('/api/connections')
        if (response.ok) {
          const connections = await response.json()
          const pending = connections.filter(
            (c: any) => c.status === 'pending' && c.receiver_id === userId
          ).length
          setPendingCount(pending)
        }
      } catch (error) {
        console.error('Error fetching pending count:', error)
      }
    }
    fetchPendingCount()
  }, [userId])

  const tabs = [
    { name: 'Overview', href: '/profile/overview', badge: null },
    { name: 'Signals', href: '/profile/signals', badge: null },
    { name: 'Connections', href: '/profile/connections', badge: pendingCount > 0 ? pendingCount : null },
    { name: 'Activity', href: '/profile/activity', badge: null },
  ]

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                relative py-3 px-1 text-sm font-medium border-b-2 transition-colors
                ${
                  isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
              {tab.badge !== null && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                  {tab.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

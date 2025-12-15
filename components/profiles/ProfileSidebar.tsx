'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  HomeIcon,
  SignalIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ViewColumnsIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline'

interface ProfileSidebarProps {
  userId: string
  isMobileMenuOpen?: boolean
  onMobileMenuClose?: () => void
}

export function ProfileSidebar({ userId, isMobileMenuOpen, onMobileMenuClose }: ProfileSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isIconHovered, setIsIconHovered] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Load sidebar state from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') {
      setIsCollapsed(true)
    }
    setMounted(true)
  }, [])

  // Handle toggle
  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
    // Dispatch custom event for layout to respond
    window.dispatchEvent(new Event('sidebar-toggle'))
  }

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

    // Fetch unread messages count
    async function fetchUnreadCount() {
      try {
        const response = await fetch('/api/conversations')
        if (response.ok) {
          const conversations = await response.json()
          const totalUnread = conversations.reduce(
            (sum: number, conv: any) => sum + (conv.unread_count || 0),
            0
          )
          setUnreadMessagesCount(totalUnread)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchPendingCount()
    fetchUnreadCount()

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchPendingCount()
      fetchUnreadCount()
    }, 10000)

    // Listen for messagesRead event to refresh immediately
    const handleMessagesRead = () => {
      fetchUnreadCount()
    }
    window.addEventListener('messagesRead', handleMessagesRead)

    return () => {
      clearInterval(interval)
      window.removeEventListener('messagesRead', handleMessagesRead)
    }
  }, [userId])

  // Calculate sidebar width
  const sidebarWidth = isCollapsed ? 64 : 240

  const menuItems = [
    {
      name: 'Overview',
      href: '/profile/overview',
      icon: HomeIcon,
      badge: null,
    },
    {
      name: 'Signals',
      href: '/profile/signals',
      icon: SignalIcon,
      badge: null,
    },
    {
      name: 'Feed',
      href: '/profile/feed',
      icon: NewspaperIcon,
      badge: null,
    },
    {
      name: 'Discover',
      href: '/discover',
      icon: MagnifyingGlassIcon,
      badge: null,
    },
    {
      name: 'Connections',
      href: '/profile/connections',
      icon: UserGroupIcon,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      name: 'Messages',
      href: '/profile/messages',
      icon: ChatBubbleLeftRightIcon,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      name: 'Activity',
      href: '/profile/activity',
      icon: ChartBarIcon,
      badge: null,
    },
  ]

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <>
        {/* Desktop sidebar placeholder */}
        <div
          className="hidden md:block fixed left-0 top-0 h-screen bg-black border-r border-gray-800 transition-all duration-300"
          style={{ width: '240px' }}
        />
      </>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-screen bg-black border-r border-gray-800 transition-all duration-200 flex flex-col z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: `${sidebarWidth}px` }}
      >
      {/* Logo/Brand */}
      <div className="py-3 px-4 flex items-center justify-between border-b border-gray-800">
        {isCollapsed ? (
          <button
            onClick={handleToggle}
            onMouseEnter={() => setIsIconHovered(true)}
            onMouseLeave={() => setIsIconHovered(false)}
            className="flex items-center justify-center w-6 h-6 text-white font-light text-lg hover:text-gray-400 transition-colors"
            title="Expand sidebar"
          >
            {isIconHovered ? (
              <ViewColumnsIcon className="w-5 h-5" />
            ) : (
              <span className="text-lg">S</span>
            )}
          </button>
        ) : (
          <>
            <Link href="/profile/overview" className="text-white font-light text-lg" prefetch={true}>
              Signal
            </Link>
            <button
              onClick={handleToggle}
              className="text-gray-400 hover:text-white transition-colors"
              title="Collapse sidebar"
            >
              <ViewColumnsIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onMobileMenuClose?.()}
              className={`
                relative flex items-center gap-3 px-4 py-3 transition-colors group
                ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <div className="relative flex-shrink-0">
                <Icon className="w-5 h-5" />
                {/* Badge dot when collapsed */}
                {isCollapsed && item.badge !== null && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>

              {/* Text and badge when expanded */}
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.badge !== null && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                  {item.badge !== null && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-600">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
    </>
  )
}

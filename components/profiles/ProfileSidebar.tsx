'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  HomeIcon,
  SignalIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface ProfileSidebarProps {
  userId: string
  isMobileMenuOpen?: boolean
  onMobileMenuClose?: () => void
}

export function ProfileSidebar({ userId, isMobileMenuOpen, onMobileMenuClose }: ProfileSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Load collapse state from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
    setMounted(true)
  }, [])

  // Save collapse state to localStorage
  const toggleCollapse = () => {
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
          className="hidden md:block fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300"
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
          fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: isCollapsed ? '64px' : '240px' }}
      >
      {/* Logo/Brand */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <Link href="/" className="text-white font-light text-lg">
          {isCollapsed ? 'S' : 'Signal'}
        </Link>
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

      {/* Collapse Toggle Button */}
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="w-5 h-5" />
          ) : (
            <>
              <ChevronDoubleLeftIcon className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
    </>
  )
}

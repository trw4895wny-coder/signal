'use client'

import { useEffect, useState } from 'react'
import {
  ChartBarIcon,
  UserGroupIcon,
  EyeIcon,
  SignalIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Avatar } from '@/components/ui/Avatar'

interface ActivityContentProps {
  userId: string
}

interface Connection {
  id: string
  created_at: string
  requester_id: string
  receiver_id: string
  requester: {
    id: string
    email: string
    full_name: string | null
    avatar_url?: string | null
  }
  receiver: {
    id: string
    email: string
    full_name: string | null
    avatar_url?: string | null
  }
}

export function ActivityContent({ userId }: ActivityContentProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/connections')
        if (response.ok) {
          const data = await response.json()
          setConnections(data.filter((c: any) => c.status === 'accepted'))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate metrics
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const newConnectionsThisWeek = connections.filter(
    (c) => new Date(c.created_at) > sevenDaysAgo
  ).length

  const newConnectionsThisMonth = connections.filter(
    (c) => new Date(c.created_at) > thirtyDaysAgo
  ).length

  // Recent activity - last 10 connections
  const recentActivity = connections
    .slice(0, 10)
    .map((c) => ({
      type: 'connection' as const,
      timestamp: c.created_at,
      user: c.requester_id === userId ? c.receiver : c.requester,
    }))

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
        <div className="text-gray-600">Loading activity...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Views - Placeholder */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Profile views</p>
              <p className="text-3xl font-light text-gray-900">—</p>
              <p className="text-xs text-gray-500 mt-2">Coming soon</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search Appearances - Placeholder */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Search appearances</p>
              <p className="text-3xl font-light text-gray-900">—</p>
              <p className="text-xs text-gray-500 mt-2">Coming soon</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* New Connections This Week */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">New connections</p>
              <p className="text-3xl font-light text-gray-900">{newConnectionsThisWeek}</p>
              <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <UserGroupIcon className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        src={activity.user.avatar_url}
                        alt={activity.user.full_name || 'User'}
                        fallbackText={activity.user.full_name || activity.user.email}
                        size="sm"
                      />
                      <p className="text-sm text-gray-900">
                        You connected with{' '}
                        <span className="font-medium">
                          {activity.user.full_name || 'Anonymous'}
                        </span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year:
                          new Date(activity.timestamp).getFullYear() !==
                          new Date().getFullYear()
                            ? 'numeric'
                            : undefined,
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No recent activity</p>
              <p className="text-sm text-gray-500 mt-1">
                Your connections and signal changes will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Who Viewed You - Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Who viewed your profile</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <EyeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Profile view tracking coming soon</p>
              <p className="text-xs text-gray-500 mt-1">
                You&apos;ll be able to see who&apos;s been checking out your profile
              </p>
            </div>
          </div>
        </div>

        {/* Signal Analytics - Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Signal analytics</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <SignalIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Signal insights coming soon</p>
              <p className="text-xs text-gray-500 mt-1">
                See which signals get the most attention
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Growth overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900">{connections.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total connections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900">{newConnectionsThisWeek}</p>
              <p className="text-sm text-gray-600 mt-1">This week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900">{newConnectionsThisMonth}</p>
              <p className="text-sm text-gray-600 mt-1">This month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900">—</p>
              <p className="text-sm text-gray-600 mt-1">Profile views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

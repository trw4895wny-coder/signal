'use client'

import { useEffect, useState } from 'react'
import { MessageModal } from '@/components/messages/MessageModal'
import { Avatar } from '@/components/ui/Avatar'
import { MagnifyingGlassIcon, FunnelIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

interface Connection {
  id: string
  requester_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
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

export function ConnectionRequests({ userId }: { userId: string }) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [messageConnection, setMessageConnection] = useState<Connection | null>(null)
  const [connectionToRemove, setConnectionToRemove] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    fetchConnections()
  }, [])

  async function fetchConnections() {
    try {
      const response = await fetch('/api/connections')
      if (response.ok) {
        const data = await response.json()
        setConnections(data)
      }
    } catch (error) {
      console.error('Error fetching connections:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleConnectionRequest(connectionId: string, status: 'accepted' | 'rejected') {
    setProcessingId(connectionId)
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchConnections()
      }
    } catch (error) {
      console.error('Error updating connection:', error)
    } finally {
      setProcessingId(null)
    }
  }

  async function handleRemoveConnection(connectionId: string) {
    setProcessingId(connectionId)
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setConnectionToRemove(null)
        await fetchConnections()
      }
    } catch (error) {
      console.error('Error removing connection:', error)
      alert('Failed to remove connection')
    } finally {
      setProcessingId(null)
    }
  }

  const pendingRequests = connections.filter(
    (c) => c.status === 'pending' && c.receiver_id === userId
  )
  const sentRequests = connections.filter(
    (c) => c.status === 'pending' && c.requester_id === userId
  )

  // Filter and sort accepted connections
  let acceptedConnections = connections.filter((c) => c.status === 'accepted')

  // Apply search filter
  if (searchQuery) {
    acceptedConnections = acceptedConnections.filter((connection) => {
      const otherUser = connection.requester_id === userId ? connection.receiver : connection.requester
      const name = otherUser.full_name || otherUser.email
      return name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

  // Apply sorting
  acceptedConnections = [...acceptedConnections].sort((a, b) => {
    const userA = a.requester_id === userId ? a.receiver : a.requester
    const userB = b.requester_id === userId ? b.receiver : b.requester

    if (sortBy === 'name') {
      const nameA = userA.full_name || userA.email
      const nameB = userB.full_name || userB.email
      return nameA.localeCompare(nameB)
    } else {
      // Sort by recent (created_at descending)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center text-gray-600">Loading connections...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests - Most Important */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border-2 border-blue-200">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Pending Connection Requests
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                {pendingRequests.length}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {pendingRequests.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={connection.requester.avatar_url}
                      alt={connection.requester.full_name || 'User'}
                      fallbackText={connection.requester.full_name || connection.requester.email}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {connection.requester.full_name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600">{connection.requester.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(connection.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleConnectionRequest(connection.id, 'accepted')}
                    disabled={processingId === connection.id}
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleConnectionRequest(connection.id, 'rejected')}
                    disabled={processingId === connection.id}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Connections */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with Search/Sort/Filter */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            {acceptedConnections.length} Connection{acceptedConnections.length !== 1 ? 's' : ''}
          </h2>

          <div className="flex items-center justify-between gap-4">
            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'name')}
                className="text-sm font-medium text-gray-900 border-none bg-transparent focus:ring-0 cursor-pointer"
              >
                <option value="recent">Recently added</option>
                <option value="name">Name</option>
              </select>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Search with filters
              </button>
            </div>
          </div>
        </div>

        {/* Connections List */}
        {acceptedConnections.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {acceptedConnections.map((connection) => {
              const otherUser =
                connection.requester_id === userId
                  ? connection.receiver
                  : connection.requester
              const isMenuOpen = openMenuId === connection.id

              return (
                <div
                  key={connection.id}
                  className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <Avatar
                    src={otherUser.avatar_url}
                    alt={otherUser.full_name || 'User'}
                    fallbackText={otherUser.full_name || otherUser.email}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">
                      {otherUser.full_name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{otherUser.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Connected {new Date(connection.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: new Date(connection.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setMessageConnection(connection)}
                      className="px-4 py-2 rounded-full border-2 border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      Message
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(isMenuOpen ? null : connection.id)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              onClick={() => {
                                setConnectionToRemove(connection.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Remove connection
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600">
              {searchQuery ? 'No connections match your search' : 'No connections yet'}
            </p>
          </div>
        )}
      </div>

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Sent Requests</h2>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                {sentRequests.length}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {sentRequests.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={connection.receiver.avatar_url}
                    alt={connection.receiver.full_name || 'User'}
                    fallbackText={connection.receiver.full_name || connection.receiver.email}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {connection.receiver.full_name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600">{connection.receiver.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Sent {new Date(connection.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {connections.length === 0 && (
        <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">No connections yet</p>
          <p className="text-sm text-gray-500">
            Discover professionals and send connection requests to start networking
          </p>
        </div>
      )}

      {/* Message Modal */}
      {messageConnection && (
        <MessageModal
          connectionId={messageConnection.id}
          currentUserId={userId}
          otherUser={
            messageConnection.requester_id === userId
              ? messageConnection.receiver
              : messageConnection.requester
          }
          onClose={() => setMessageConnection(null)}
        />
      )}

      {/* Remove Connection Confirmation */}
      {connectionToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setConnectionToRemove(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Remove Connection?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove this connection? You&apos;ll need to send a new request to reconnect.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConnectionToRemove(null)}
                disabled={processingId === connectionToRemove}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveConnection(connectionToRemove)}
                disabled={processingId === connectionToRemove}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processingId === connectionToRemove ? 'Removing...' : 'Remove Connection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

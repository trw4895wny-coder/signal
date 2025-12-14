'use client'

import { useEffect, useState } from 'react'

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
  }
  receiver: {
    id: string
    email: string
    full_name: string | null
  }
}

export function ConnectionRequests({ userId }: { userId: string }) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

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
        // Refresh connections
        await fetchConnections()
      }
    } catch (error) {
      console.error('Error updating connection:', error)
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
  const acceptedConnections = connections.filter((c) => c.status === 'accepted')

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center text-gray-600">Loading connections...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {connection.requester.full_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">{connection.requester.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(connection.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConnectionRequest(connection.id, 'accepted')}
                    disabled={processingId === connection.id}
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleConnectionRequest(connection.id, 'rejected')}
                    disabled={processingId === connection.id}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sent Requests ({sentRequests.length})
          </h2>
          <div className="space-y-3">
            {sentRequests.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {connection.receiver.full_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">{connection.receiver.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sent {new Date(connection.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Connections */}
      {acceptedConnections.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Connections ({acceptedConnections.length})
          </h2>
          <div className="space-y-3">
            {acceptedConnections.map((connection) => {
              const otherUser =
                connection.requester_id === userId
                  ? connection.receiver
                  : connection.requester
              return (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {otherUser.full_name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600">{otherUser.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    Connected
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {connections.length === 0 && (
        <div className="bg-white rounded-lg p-12 shadow-sm text-center">
          <p className="text-gray-600">No connections yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Discover professionals and send connection requests to start networking
          </p>
        </div>
      )}
    </div>
  )
}

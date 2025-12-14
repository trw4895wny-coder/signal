'use client'

import { useState, useEffect } from 'react'

interface Conversation {
  connection_id: string
  other_user: {
    id: string
    email: string
    full_name: string | null
    headline?: string | null
    avatar_url?: string | null
  }
  last_message: {
    id: string
    sender_id: string
    content: string
    created_at: string
  } | null
  unread_count: number
  last_activity: string
}

interface ConversationListProps {
  currentUserId: string
  selectedConnectionId: string | null
  onSelectConversation: (connectionId: string) => void
}

export function ConversationList({
  currentUserId,
  selectedConnectionId,
  onSelectConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchConversations()
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [])

  async function fetchConversations() {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true
    const name = conv.other_user.full_name || conv.other_user.email
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getInitials = (user: Conversation['other_user']) => {
    if (user.full_name) {
      return user.full_name[0].toUpperCase()
    }
    return user.email[0].toUpperCase()
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const truncateMessage = (content: string, maxLength: number = 60) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-medium text-gray-900 mb-3">Messages</h1>
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-600 font-medium mb-1">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? 'Try a different search'
                : 'Start by connecting with professionals'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = conversation.connection_id === selectedConnectionId
            const isUnread = conversation.unread_count > 0
            const lastMessagePreview = conversation.last_message
              ? conversation.last_message.sender_id === currentUserId
                ? `You: ${truncateMessage(conversation.last_message.content)}`
                : truncateMessage(conversation.last_message.content)
              : 'Start messaging'

            return (
              <button
                key={conversation.connection_id}
                onClick={() => onSelectConversation(conversation.connection_id)}
                className={`w-full flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  isSelected ? 'bg-gray-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-900 text-white flex items-center justify-center font-medium">
                    {conversation.other_user.avatar_url ? (
                      <img
                        src={`${conversation.other_user.avatar_url}?t=${Date.now()}`}
                        alt={conversation.other_user.full_name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(conversation.other_user)}</span>
                    )}
                  </div>
                  {isUnread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3
                      className={`text-sm truncate ${
                        isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'
                      }`}
                    >
                      {conversation.other_user.full_name || 'Anonymous'}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {getRelativeTime(conversation.last_activity)}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      isUnread ? 'font-medium text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {lastMessagePreview}
                  </p>
                </div>

                {/* Unread Badge */}
                {isUnread && (
                  <div className="flex-shrink-0 mt-1">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white min-w-[20px]">
                      {conversation.unread_count}
                    </span>
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

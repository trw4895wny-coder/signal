'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  connection_id: string
  sender_id: string
  content: string
  created_at: string
  sender: {
    id: string
    email: string
    full_name: string | null
    avatar_url?: string | null
  }
}

interface MessageThreadProps {
  connectionId: string
  currentUserId: string
  otherUser: {
    id: string
    full_name: string | null
    email: string
    headline?: string | null
    avatar_url?: string | null
  }
  onRemoveConnection?: () => void
}

const MAX_MESSAGE_LENGTH = 2000

export function MessageThread({
  connectionId,
  currentUserId,
  otherUser,
  onRemoveConnection,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchMessages()
    markAsRead()

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [connectionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchMessages() {
    try {
      const response = await fetch(`/api/messages?connection_id=${connectionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        setError(null)
      } else {
        setError('Failed to load messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead() {
    try {
      await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connection_id: connectionId }),
      })
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    if (newMessage.length > MAX_MESSAGE_LENGTH) {
      alert(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`)
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connection_id: connectionId,
          content: newMessage.trim(),
        }),
      })

      if (response.ok) {
        setNewMessage('')
        await fetchMessages()
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      } else {
        setError('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const getInitials = () => {
    if (otherUser.full_name) {
      return otherUser.full_name[0].toUpperCase()
    }
    return otherUser.email[0].toUpperCase()
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = new Date(message.created_at)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateKey: string
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday'
      } else {
        dateKey = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        })
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)
  const remainingChars = MAX_MESSAGE_LENGTH - newMessage.length
  const showCharCount = newMessage.length > MAX_MESSAGE_LENGTH * 0.8

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <Link
          href={`/profile/overview`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-900 text-white flex items-center justify-center font-medium">
            {otherUser.avatar_url ? (
              <img
                src={`${otherUser.avatar_url}?t=${Date.now()}`}
                alt={otherUser.full_name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
          <div>
            <h2 className="font-medium text-gray-900">
              {otherUser.full_name || 'Anonymous'}
            </h2>
            {otherUser.headline && (
              <p className="text-xs text-gray-500 line-clamp-1">{otherUser.headline}</p>
            )}
          </div>
        </Link>

        {onRemoveConnection && (
          <button
            onClick={onRemoveConnection}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="More options"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No messages yet</p>
            <p className="text-sm text-gray-400">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex items-center justify-center mb-4">
                  <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                    {date}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {msgs.map((message) => {
                    const isCurrentUser = message.sender_id === currentUserId
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isCurrentUser
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-gray-300' : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchMessages}
              className="text-sm text-red-700 font-medium hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-gray-900 focus:border-transparent overflow-hidden"
              style={{ maxHeight: '120px' }}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {showCharCount && (
              <span
                className={remainingChars < 0 ? 'text-red-600 font-medium' : 'text-gray-500'}
              >
                {remainingChars} characters remaining
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/Avatar'

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
    avatar_url: string | null
  }
}

interface MessageModalProps {
  connectionId: string
  currentUserId: string
  otherUser: {
    id: string
    full_name: string | null
    email: string
    avatar_url?: string | null
  }
  onClose: () => void
}

export function MessageModal({
  connectionId,
  currentUserId,
  otherUser,
  onClose,
}: MessageModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchMessages()
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000)
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
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
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
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const getInitials = () => {
    if (otherUser.full_name) {
      return otherUser.full_name[0].toUpperCase()
    }
    return otherUser.email[0].toUpperCase()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar
              src={otherUser.avatar_url}
              alt={otherUser.full_name || 'User'}
              fallbackText={otherUser.full_name || otherUser.email}
              size="md"
            />
            <div>
              <h2 className="font-medium text-gray-900">
                {otherUser.full_name || 'Anonymous'}
              </h2>
              <p className="text-xs text-gray-500">{otherUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-500 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">Send a message to start the conversation</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
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
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
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
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

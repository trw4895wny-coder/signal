'use client'

import { useState, useEffect } from 'react'
import { ConversationList } from './ConversationList'
import { MessageThread } from './MessageThread'

interface MessagingHubProps {
  userId: string
}

interface Conversation {
  connection_id: string
  other_user: {
    id: string
    email: string
    full_name: string | null
    headline?: string | null
    avatar_url?: string | null
  }
  last_message: any
  unread_count: number
  last_activity: string
}

export function MessagingHub({ userId }: MessagingHubProps) {
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch conversation details when selected
  useEffect(() => {
    if (selectedConnectionId) {
      fetchConversationDetails()
    }
  }, [selectedConnectionId])

  async function fetchConversationDetails() {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const conversations = await response.json()
        const conversation = conversations.find(
          (c: Conversation) => c.connection_id === selectedConnectionId
        )
        if (conversation) {
          setSelectedConversation(conversation)
        }
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error)
    }
  }

  const handleSelectConversation = (connectionId: string) => {
    setSelectedConnectionId(connectionId)
  }

  const handleBackToList = () => {
    setSelectedConnectionId(null)
    setSelectedConversation(null)
  }

  // Mobile view: Show either list or thread
  if (isMobile) {
    if (selectedConnectionId && selectedConversation) {
      return (
        <div className="h-[calc(100vh-200px)] flex flex-col">
          {/* Back button */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm font-medium">Back to messages</span>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <MessageThread
              connectionId={selectedConnectionId}
              currentUserId={userId}
              otherUser={selectedConversation.other_user}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="h-[calc(100vh-200px)]">
        <ConversationList
          currentUserId={userId}
          selectedConnectionId={selectedConnectionId}
          onSelectConversation={handleSelectConversation}
        />
      </div>
    )
  }

  // Desktop view: Two-panel layout
  return (
    <div className="h-[calc(100vh-200px)] flex rounded-lg overflow-hidden border border-gray-200">
      {/* Left Panel - Conversation List */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          currentUserId={userId}
          selectedConnectionId={selectedConnectionId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Right Panel - Message Thread */}
      <div className="flex-1">
        {selectedConnectionId && selectedConversation ? (
          <MessageThread
            connectionId={selectedConnectionId}
            currentUserId={userId}
            otherUser={selectedConversation.other_user}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-white text-center p-8">
            <svg
              className="w-20 h-20 text-gray-300 mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-500">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

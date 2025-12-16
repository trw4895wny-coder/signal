'use client'

import { useState } from 'react'
import { XMarkIcon, BoltIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface QuickPostTemplatesProps {
  userId: string
  userSignals: Array<{
    id: string
    label: string
  }>
  userProfile: {
    full_name?: string | null
    city?: string | null
    state?: string | null
  }
  onClose: () => void
  onPostCreated: () => void
}

interface Template {
  id: string
  name: string
  icon: string
  description: string
  postType: 'update' | 'help_request' | 'offering_help' | 'project' | 'collaboration'
  urgent: boolean
  content: string
}

export function QuickPostTemplates({
  userId,
  userSignals,
  userProfile,
  onClose,
  onPostCreated,
}: QuickPostTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isPosting, setIsPosting] = useState(false)

  const templates: Template[] = [
    {
      id: 'available-today',
      name: 'Available Today',
      icon: '⚡',
      description: 'Post that you\'re available for work today',
      postType: 'update',
      urgent: true,
      content: 'Available for work today',
    },
    {
      id: 'available-week',
      name: 'Available This Week',
      icon: '🟢',
      description: 'Post your availability for this week',
      postType: 'update',
      urgent: false,
      content: 'Available for work this week',
    },
    {
      id: 'hiring-urgent',
      name: 'Hiring Urgently',
      icon: '🔴',
      description: 'Need someone ASAP',
      postType: 'help_request',
      urgent: true,
      content: 'Looking to hire immediately',
    },
  ]

  const handleQuickPost = async (template: Template) => {
    setIsPosting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: template.content,
          post_type: template.postType,
          signal_ids: userSignals.map(s => s.id),
          // Posts will auto-expire in 7 days via database trigger
        }),
      })

      if (response.ok) {
        onPostCreated()
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setIsPosting(false)
    }
  }

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template)
  }

  const handleConfirmPost = () => {
    if (selectedTemplate) {
      handleQuickPost(selectedTemplate)
    }
  }

  if (selectedTemplate) {
    // Preview/Confirmation screen
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
        <div className="bg-white w-full md:max-w-lg md:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Preview Post</h2>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Preview */}
          <div className="p-6">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-4">
              {/* Urgency badge */}
              {selectedTemplate.urgent && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <BoltIcon className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-red-700">URGENT</span>
                </div>
              )}

              {/* User info */}
              <div className="mb-3">
                <h3 className="font-medium text-gray-900">
                  {userProfile.full_name || 'Your Profile'}
                </h3>
                {userSignals.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {userSignals.map(s => s.label).join(' • ')}
                  </p>
                )}
                {(userProfile.city || userProfile.state) && (
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {userProfile.city}{userProfile.city && userProfile.state && ', '}{userProfile.state}
                  </p>
                )}
              </div>

              {/* Content */}
              <p className="text-gray-900 mb-3">&quot;{selectedTemplate.content}&quot;</p>

              {/* Signals */}
              {userSignals.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {userSignals.map((signal) => (
                    <span
                      key={signal.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {signal.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Expiration notice */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <CalendarIcon className="w-3 h-3" />
                <span>Expires in 7 days</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPost}
                disabled={isPosting}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {isPosting ? 'Posting...' : 'Post Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Template selection screen
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:max-w-lg md:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Templates */}
        <div className="p-4 space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {template.name}
                    {template.urgent && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        URGENT
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Custom post option */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full p-3 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Create Custom Post Instead
          </button>
        </div>
      </div>
    </div>
  )
}

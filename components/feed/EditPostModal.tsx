'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Signal {
  id: string
  label: string
  category_id: string
}

interface EditPostModalProps {
  post: {
    id: string
    content: string
    post_type: string
    post_signals?: Array<{
      signal: {
        id: string
        label: string
      }
    }>
  }
  userSignals: Signal[]
  onClose: () => void
  onSave: () => void
}

export function EditPostModal({ post, userSignals, onClose, onSave }: EditPostModalProps) {
  const [content, setContent] = useState(post.content)
  const [postType, setPostType] = useState<'update' | 'help_request' | 'offering_help' | 'project' | 'collaboration'>(
    post.post_type as any
  )
  const [selectedSignals, setSelectedSignals] = useState<string[]>(
    post.post_signals?.map((ps) => ps.signal.id) || []
  )
  const [isSaving, setIsSaving] = useState(false)

  const postTypes = [
    { value: 'update', label: 'Update', color: 'blue' },
    { value: 'help_request', label: 'Need Help', color: 'orange' },
    { value: 'offering_help', label: 'Offering Help', color: 'green' },
    { value: 'project', label: 'Project', color: 'purple' },
    { value: 'collaboration', label: 'Collaboration', color: 'pink' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          post_type: postType,
          signal_ids: selectedSignals,
        }),
      })

      if (response.ok) {
        onSave()
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSignal = (signalId: string) => {
    setSelectedSignals((prev) =>
      prev.includes(signalId)
        ? prev.filter((id) => id !== signalId)
        : [...prev, signalId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <div className="flex flex-wrap gap-2">
              {postTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPostType(type.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    postType === type.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What&apos;s on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an update, ask for help, or start a conversation..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Link Signals */}
          {userSignals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to your signals (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {userSignals.map((signal) => (
                  <button
                    key={signal.id}
                    type="button"
                    onClick={() => toggleSignal(signal.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedSignals.includes(signal.id)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {signal.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !content.trim()}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

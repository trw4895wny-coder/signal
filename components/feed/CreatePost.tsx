'use client'

import { useState, useEffect } from 'react'
import {
  PhotoIcon,
  LinkIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface CreatePostProps {
  userId: string
  onPostCreated: () => void
}

interface Signal {
  id: string
  name: string
  category_id: string
}

export function CreatePost({ userId, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<'update' | 'help_request' | 'offering_help' | 'project' | 'collaboration'>('update')
  const [selectedSignals, setSelectedSignals] = useState<string[]>([])
  const [expiresIn, setExpiresIn] = useState<number>(0) // 0 = never
  const [loading, setLoading] = useState(false)
  const [userSignals, setUserSignals] = useState<Signal[]>([])
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    // Fetch user's active signals
    async function fetchSignals() {
      try {
        const response = await fetch(`/api/user-signals?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setUserSignals(data.map((us: any) => us.signal))
        }
      } catch (error) {
        console.error('Error fetching signals:', error)
      }
    }
    fetchSignals()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          post_type: postType,
          signal_ids: selectedSignals,
          expires_in_days: expiresIn || null,
        }),
      })

      if (response.ok) {
        setContent('')
        setSelectedSignals([])
        setExpiresIn(0)
        setShowOptions(false)
        onPostCreated()
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const postTypes = [
    { value: 'update', label: 'Update', color: 'blue' },
    { value: 'help_request', label: 'Need Help', color: 'orange' },
    { value: 'offering_help', label: 'Offering Help', color: 'green' },
    { value: 'project', label: 'Project', color: 'purple' },
    { value: 'collaboration', label: 'Collaboration', color: 'pink' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are you working on? Need help with something?"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          rows={3}
        />

        {/* Post Type Selector */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {postTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setPostType(type.value as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                postType === type.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="mt-3 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <SparklesIcon className="w-4 h-4" />
          {showOptions ? 'Hide options' : 'Tag signals & set expiration'}
        </button>

        {/* Advanced Options */}
        {showOptions && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
            {/* Signal Tags */}
            {userSignals.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Link to your signals (helps with smart matching)
                </label>
                <div className="flex flex-wrap gap-2">
                  {userSignals.map((signal) => (
                    <button
                      key={signal.id}
                      type="button"
                      onClick={() => {
                        if (selectedSignals.includes(signal.id)) {
                          setSelectedSignals(selectedSignals.filter(id => id !== signal.id))
                        } else {
                          setSelectedSignals([...selectedSignals, signal.id])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedSignals.includes(signal.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {signal.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Expiration */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <ClockIcon className="w-3 h-3 inline mr-1" />
                Expiration (keeps feed fresh)
              </label>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={0}>Never expires</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {content.length}/2000 characters
          </div>
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

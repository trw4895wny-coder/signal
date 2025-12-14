'use client'

import { useState } from 'react'
import { AvatarUpload } from './AvatarUpload'
import { createClient } from '@/lib/supabase/client'

interface EditProfileModalProps {
  userId: string
  currentProfile: {
    full_name?: string | null
    headline?: string | null
    bio?: string | null
    location?: string | null
    website?: string | null
    avatar_url?: string | null
  }
  onClose: () => void
  onSave: () => void
}

export function EditProfileModal({
  userId,
  currentProfile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState(currentProfile.full_name || '')
  const [headline, setHeadline] = useState(currentProfile.headline || '')
  const [bio, setBio] = useState(currentProfile.bio || '')
  const [location, setLocation] = useState(currentProfile.location || '')
  const [website, setWebsite] = useState(currentProfile.website || '')
  const [avatarUrl, setAvatarUrl] = useState(currentProfile.avatar_url || null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()

      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: fullName || null,
          headline: headline || null,
          bio: bio || null,
          location: location || null,
          website: website || null,
        })
        .eq('id', userId)

      if (error) throw error

      onSave()
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-medium">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <AvatarUpload
              userId={userId}
              currentAvatarUrl={avatarUrl}
              onUploadComplete={(url) => setAvatarUrl(url)}
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>

          {/* Headline */}
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
              Headline
              <span className="text-gray-500 font-normal ml-2">
                {headline.length}/100
              </span>
            </label>
            <input
              type="text"
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value.slice(0, 100))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Full-stack developer | AI enthusiast"
            />
            <p className="text-xs text-gray-500 mt-1">
              A short description that appears on your profile and discover cards
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
              <span className="text-gray-500 font-normal ml-2">
                {bio.length}/500
              </span>
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 500))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value.slice(0, 50))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="San Francisco, CA"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value.slice(0, 200))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

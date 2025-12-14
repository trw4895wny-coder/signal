'use client'

import { useState, useEffect } from 'react'
import { EditProfileModal } from './EditProfileModal'

interface ProfileOverviewProps {
  userId: string
  profile: {
    full_name?: string | null
    headline?: string | null
    bio?: string | null
    location?: string | null
    website?: string | null
    avatar_url?: string | null
    email?: string
    memberSince?: string
  }
}

export function ProfileOverview({ userId, profile }: ProfileOverviewProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)
  const [avatarKey, setAvatarKey] = useState(Date.now())
  const [connectionStats, setConnectionStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
  })

  useEffect(() => {
    // Fetch connection stats
    async function fetchStats() {
      try {
        const response = await fetch('/api/connections')
        if (response.ok) {
          const connections = await response.json()
          const accepted = connections.filter((c: any) => c.status === 'accepted').length
          const pending = connections.filter(
            (c: any) => c.status === 'pending' && c.receiver_id === userId
          ).length
          const sent = connections.filter(
            (c: any) => c.status === 'pending' && c.requester_id === userId
          ).length
          setConnectionStats({ total: accepted, pending, sent })
        }
      } catch (error) {
        console.error('Error fetching connection stats:', error)
      }
    }
    fetchStats()
  }, [userId])

  const handleProfileUpdate = () => {
    // Update avatar key to force reload with cache busting
    setAvatarKey(Date.now())
    // Refresh the page to get updated data
    window.location.reload()
  }

  const getInitials = () => {
    if (currentProfile.full_name) {
      return currentProfile.full_name[0].toUpperCase()
    }
    if (currentProfile.email) {
      return currentProfile.email[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 w-32 h-32">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 text-white flex items-center justify-center text-4xl font-medium shadow-lg">
              {currentProfile.avatar_url ? (
                <img
                  src={`${currentProfile.avatar_url}?t=${avatarKey}`}
                  alt={currentProfile.full_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials()}</span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-medium text-gray-900">
                  {currentProfile.full_name || 'Your Profile'}
                </h1>
                {currentProfile.headline && (
                  <p className="text-base text-gray-700 mt-1">{currentProfile.headline}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                  {currentProfile.location && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {currentProfile.location}
                    </div>
                  )}
                  {currentProfile.website && (
                    <a
                      href={currentProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Website
                    </a>
                  )}
                  {currentProfile.memberSince && (
                    <span className="text-gray-500">
                      Member since {currentProfile.memberSince}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(true)}
                className="ml-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Bio */}
            {currentProfile.bio && (
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">{currentProfile.bio}</p>
            )}

            {/* Connection Stats */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {connectionStats.total}
                </div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              {connectionStats.pending > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-blue-600">
                    {connectionStats.pending}
                  </div>
                  <div className="text-sm text-gray-600">Pending Requests</div>
                </div>
              )}
              {connectionStats.sent > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-yellow-600">
                    {connectionStats.sent}
                  </div>
                  <div className="text-sm text-gray-600">Sent</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty state if no bio/headline */}
      {!currentProfile.headline && !currentProfile.bio && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                Complete your profile
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Add a headline and bio to help others discover you and understand what
                you&apos;re all about.
              </p>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Add details →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <EditProfileModal
          userId={userId}
          currentProfile={currentProfile}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  )
}

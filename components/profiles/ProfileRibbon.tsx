'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { EditProfileModal } from './EditProfileModal'
import type { UserSignalWithDetails } from '@/types/signals'

interface ProfileRibbonProps {
  userId: string
  profile: {
    full_name?: string | null
    headline?: string | null
    bio?: string | null
    city?: string | null
    state?: string | null
    latitude?: number | null
    longitude?: number | null
    location?: string | null
    website?: string | null
    avatar_url?: string | null
    email?: string
  }
  userSignals: UserSignalWithDetails[]
  connectionStats: {
    total: number
    pending: number
    sent: number
  }
  categories: any[]
  signalsByCategory: Record<string, any[]>
}

export function ProfileRibbon({
  userId,
  profile,
  userSignals,
  connectionStats,
  categories,
  signalsByCategory,
}: ProfileRibbonProps) {
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(false)

  const handleProfileUpdate = () => {
    router.refresh()
  }

  const avatarUrl = profile.avatar_url
    ? `${profile.avatar_url}?t=${Date.now()}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email || 'default'}`

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={avatarUrl}
              alt={profile.full_name || 'Profile'}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {profile.full_name || 'Your Profile'}
                </h1>
                {profile.headline && (
                  <p className="text-sm text-gray-600 mt-0.5">{profile.headline}</p>
                )}
                {(profile.city || profile.state) && (
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {profile.city}{profile.city && profile.state && ', '}{profile.state}
                  </p>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Signals */}
            {userSignals.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {userSignals.slice(0, 5).map((userSignal) => (
                  <span
                    key={userSignal.id}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-medium"
                    title={userSignal.signal.description || undefined}
                  >
                    {userSignal.signal.label}
                  </span>
                ))}
                {userSignals.length > 5 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    +{userSignals.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Connection Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-900">{connectionStats.total}</span>
                <span className="text-gray-600 ml-1">connections</span>
              </div>
              {connectionStats.pending > 0 && (
                <div>
                  <span className="font-semibold text-blue-600">{connectionStats.pending}</span>
                  <span className="text-gray-600 ml-1">pending</span>
                </div>
              )}
              {connectionStats.sent > 0 && (
                <div>
                  <span className="font-semibold text-yellow-600">{connectionStats.sent}</span>
                  <span className="text-gray-600 ml-1">sent</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditProfileModal
          userId={userId}
          currentProfile={profile}
          userSignals={userSignals}
          categories={categories}
          signalsByCategory={signalsByCategory}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            handleProfileUpdate()
            setShowEditModal(false)
          }}
        />
      )}
    </>
  )
}

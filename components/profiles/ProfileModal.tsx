'use client'

import { useEffect, useState } from 'react'
import type { ProfileWithSignals } from '@/types/signals'
import { getDaysUntilExpiration } from '@/types/signals'

interface ProfileModalProps {
  profile: ProfileWithSignals
  currentUserId: string | null
  onClose: () => void
}

export function ProfileModal({ profile, currentUserId, onClose }: ProfileModalProps) {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Check if viewing own profile
  const isOwnProfile = currentUserId === profile.id

  const handleSendConnectionRequest = async () => {
    setConnectionStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_id: profile.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send connection request')
      }

      setConnectionStatus('sent')
    } catch (error) {
      setConnectionStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send request')
    }
  }

  // Close on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Group signals by category
  const signalsByCategory = profile.signals.reduce(
    (acc, userSignal) => {
      const categoryName = userSignal.signal.category.name
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(userSignal)
      return acc
    },
    {} as Record<string, typeof profile.signals>
  )

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-8 animate-zoomIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              {profile.full_name || 'Anonymous'}
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">{profile.email}</p>
            <p className="text-xs text-gray-500 mt-1">Member since {memberSince}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors -mt-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="px-6 py-4">
          {profile.signals.length > 0 ? (
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">Signals</h3>
              <div className="space-y-4">
                {Object.entries(signalsByCategory).map(([categoryName, signals]) => (
                  <div key={categoryName}>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      {categoryName}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {signals.map((userSignal) => {
                        const daysLeft = getDaysUntilExpiration(userSignal)
                        return (
                          <div
                            key={userSignal.id}
                            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
                            title={userSignal.signal.description || undefined}
                          >
                            <span>{userSignal.signal.label}</span>
                            {daysLeft !== null && (
                              <span className="flex items-center gap-1 text-xs text-white/70">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {daysLeft}d
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Connection Request Section - Only show if not own profile */}
              {!isOwnProfile && (
                <div className="mt-5 pt-4 border-t border-gray-200">
                  {connectionStatus === 'sent' ? (
                    <div className="text-center py-3">
                      <div className="inline-flex items-center gap-2 text-green-700 mb-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">Request sent</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        They&apos;ll be notified
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Interested in connecting?
                      </p>
                      {errorMessage && (
                        <p className="text-xs text-red-600 mb-2">{errorMessage}</p>
                      )}
                      <button
                        onClick={handleSendConnectionRequest}
                        disabled={connectionStatus === 'sending'}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connectionStatus === 'sending' ? (
                          <>
                            <svg
                              className="animate-spin w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send connection request'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No signals set</p>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

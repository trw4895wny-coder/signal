'use client'

import { useEffect, useState } from 'react'
import { FilterChips } from '@/components/signals/FilterChips'
import { ProfileCard } from '@/components/profiles/ProfileCard'
import { ProfileModal } from '@/components/profiles/ProfileModal'
import type { ProfileWithSignals, SignalCategory, Signal } from '@/types/signals'

export default function DiscoverContent() {
  const [profiles, setProfiles] = useState<ProfileWithSignals[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileWithSignals[]>([])
  const [categories, setCategories] = useState<SignalCategory[]>([])
  const [signalsByCategory, setSignalsByCategory] = useState<Record<string, Signal[]>>({})
  const [selectedSignals, setSelectedSignals] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithSignals | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const PROFILES_PER_PAGE = 20

  useEffect(() => {
    async function fetchData() {
      try {
        const [profilesRes, categoriesRes, signalsRes, userRes] = await Promise.all([
          fetch('/api/profiles'),
          fetch('/api/signals/categories'),
          fetch('/api/signals'),
          fetch('/api/auth/user'),
        ])

        const profilesData = await profilesRes.json()
        const categoriesData = await categoriesRes.json()
        const signalsData = await signalsRes.json()
        const userData = await userRes.json()

        setProfiles(profilesData)
        setFilteredProfiles(profilesData)
        setCategories(categoriesData)
        setCurrentUserId(userData?.id || null)

        // Group signals by category
        const grouped = signalsData.reduce((acc: Record<string, Signal[]>, signal: Signal) => {
          if (!acc[signal.category_id]) {
            acc[signal.category_id] = []
          }
          acc[signal.category_id].push(signal)
          return acc
        }, {})
        setSignalsByCategory(grouped)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedSignals.length === 0) {
      setFilteredProfiles([])
    } else {
      const filtered = profiles.filter((profile) =>
        selectedSignals.some((signalId) =>
          profile.signals.some((us) => us.signal_id === signalId)
        )
      )
      setFilteredProfiles(filtered)
    }
    setCurrentPage(1)
  }, [selectedSignals, profiles])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE)
  const startIndex = (currentPage - 1) * PROFILES_PER_PAGE
  const endIndex = startIndex + PROFILES_PER_PAGE
  const currentProfiles = filteredProfiles.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
          <h1 className="text-3xl font-light mb-2">Discover professionals</h1>
          <p className="text-gray-600">
            Find people by their signals, not keywords
          </p>
        </div>

        {/* Filter Chips */}
        <div className="mb-8">
          <FilterChips
            categories={categories}
            signalsByCategory={signalsByCategory}
            onFilterChange={setSelectedSignals}
          />
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Profile grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onClick={() => setSelectedProfile(profile)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {selectedSignals.length === 0
                ? 'Add filters to discover professionals'
                : 'No profiles match your filters'}
            </p>
          </div>
        )}

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          currentUserId={currentUserId}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </>
  )
}

export default DiscoverContent

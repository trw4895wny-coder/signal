'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FilterChips } from '@/components/signals/FilterChips'
import { ProfileCard } from '@/components/profiles/ProfileCard'
import type { ProfileWithSignals, SignalCategory, Signal } from '@/types/signals'

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<ProfileWithSignals[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileWithSignals[]>([])
  const [categories, setCategories] = useState<SignalCategory[]>([])
  const [signalsByCategory, setSignalsByCategory] = useState<Record<string, Signal[]>>({})
  const [selectedSignals, setSelectedSignals] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profilesRes, categoriesRes, signalsRes] = await Promise.all([
          fetch('/api/profiles'),
          fetch('/api/signals/categories'),
          fetch('/api/signals'),
        ])

        const profilesData = await profilesRes.json()
        const categoriesData = await categoriesRes.json()
        const signalsData = await signalsRes.json()

        setProfiles(profilesData)
        setFilteredProfiles(profilesData)
        setCategories(categoriesData)

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
      setFilteredProfiles(profiles)
    } else {
      const filtered = profiles.filter((profile) =>
        profile.signals.some((us) => selectedSignals.includes(us.signal_id))
      )
      setFilteredProfiles(filtered)
    }
  }, [selectedSignals, profiles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-light">
            Signal
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Profile
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
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
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No profiles match your filters</p>
          </div>
        )}
      </main>
    </div>
  )
}

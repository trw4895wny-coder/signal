'use client'

import { useState } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface LocationFilterProps {
  userLocation: {
    city?: string | null
    state?: string | null
  }
  onFilterChange: (distance: number | null) => void
}

export function LocationFilter({ userLocation, onFilterChange }: LocationFilterProps) {
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null)

  const distanceOptions = [
    { value: null, label: 'Anywhere' },
    { value: 5, label: 'Within 5 miles' },
    { value: 10, label: 'Within 10 miles' },
    { value: 25, label: 'Within 25 miles' },
    { value: 50, label: 'Within 50 miles' },
    { value: 100, label: 'Within 100 miles' },
  ]

  const handleDistanceChange = (distance: number | null) => {
    setSelectedDistance(distance)
    onFilterChange(distance)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPinIcon className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Location</h3>
      </div>

      {userLocation.city || userLocation.state ? (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            Your location: <span className="font-medium text-gray-900">
              {userLocation.city}{userLocation.city && userLocation.state && ', '}{userLocation.state}
            </span>
          </p>
        </div>
      ) : (
        <div className="mb-3 text-sm text-gray-500">
          Set your location in your profile to filter by distance
        </div>
      )}

      <div className="space-y-2">
        {distanceOptions.map((option) => (
          <button
            key={option.value ?? 'anywhere'}
            onClick={() => handleDistanceChange(option.value)}
            disabled={!userLocation.city && !userLocation.state && option.value !== null}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedDistance === option.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {selectedDistance && (
        <div className="mt-3 text-xs text-gray-500">
          Note: Distance filtering requires both you and others to have locations set
        </div>
      )}
    </div>
  )
}

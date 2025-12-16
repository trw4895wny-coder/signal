'use client'

import { useState } from 'react'
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface LocationFilterModalProps {
  userLocation: {
    city?: string | null
    state?: string | null
  }
  currentDistance: number | null
  onApply: (distance: number | null) => void
  onClose: () => void
}

export function LocationFilterModal({
  userLocation,
  currentDistance,
  onApply,
  onClose
}: LocationFilterModalProps) {
  const [selectedDistance, setSelectedDistance] = useState<number | null>(currentDistance)

  const distanceOptions = [
    { value: null, label: 'Anywhere' },
    { value: 5, label: 'Within 5 miles' },
    { value: 10, label: 'Within 10 miles' },
    { value: 25, label: 'Within 25 miles' },
    { value: 50, label: 'Within 50 miles' },
    { value: 100, label: 'Within 100 miles' },
  ]

  const handleApply = () => {
    onApply(selectedDistance)
    onClose()
  }

  const hasLocation = userLocation.city || userLocation.state

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:max-w-md md:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">Location Filter</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Location Display */}
          {hasLocation ? (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Your location:</p>
              <p className="text-sm font-medium text-gray-900">
                {userLocation.city}{userLocation.city && userLocation.state && ', '}{userLocation.state}
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Set your location in your profile to filter by distance
              </p>
            </div>
          )}

          {/* Distance Options */}
          <div className="space-y-2">
            {distanceOptions.map((option) => (
              <button
                key={option.value ?? 'anywhere'}
                onClick={() => setSelectedDistance(option.value)}
                disabled={!hasLocation && option.value !== null}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedDistance === option.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Note */}
          {selectedDistance && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                Note: Distance filtering requires both you and others to have locations set
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  )
}

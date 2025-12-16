'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface LocationResult {
  display_name: string
  lat: string
  lon: string
  type?: string
  class?: string
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    country_code?: string
  }
}

interface LocationAutocompleteProps {
  value: string
  onChange: (location: {
    displayText: string
    city: string
    state: string
    country: string
    latitude: number
    longitude: number
  }) => void
  onGettingLocation?: (isGetting: boolean) => void
}

export function LocationAutocomplete({
  value,
  onChange,
  onGettingLocation,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<LocationResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions from Nominatim
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=20&` +
        `countrycodes=us`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Filter to only show city/town/village level results (not streets or addresses)
      const cityLevelResults = data.filter((result: LocationResult) => {
        const type = result.type || result.class
        const addressType = result.address?.city || result.address?.town || result.address?.village

        // Only include results that are cities, towns, villages, or administrative areas
        const validTypes = ['city', 'town', 'village', 'administrative', 'municipality']
        return (type && validTypes.includes(type)) || addressType
      })

      setSuggestions(cityLevelResults.slice(0, 5))
      setIsOpen(cityLevelResults.length > 0)
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setInputValue(query)
    setSelectedIndex(-1)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 300)
  }

  // Format location for display
  const formatLocation = (result: LocationResult): string => {
    const city = result.address.city || result.address.town || result.address.village || ''
    const state = result.address.state || ''
    const countryCode = result.address.country_code?.toUpperCase() || 'US'

    return `${city}, ${state}, ${countryCode}`.replace(/, ,/g, ',').replace(/^, |, $/g, '')
  }

  // Handle selection
  const handleSelect = (result: LocationResult) => {
    const city = result.address.city || result.address.town || result.address.village || ''
    const state = result.address.state || ''
    const country = result.address.country || 'United States'
    const displayText = formatLocation(result)

    setInputValue(displayText)
    setIsOpen(false)
    setSuggestions([])

    onChange({
      displayText,
      city,
      state,
      country,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    })
  }

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser')
      return
    }

    onGettingLocation?.(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        try {
          // Reverse geocode - Add a small delay to respect Nominatim rate limits
          await new Promise(resolve => setTimeout(resolve, 500))

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          )

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county || ''
            const state = data.address.state || ''
            const country = data.address.country || 'United States'
            const countryCode = data.address.country_code?.toUpperCase() || 'US'

            if (!city && !state) {
              throw new Error('Could not determine city/state from location')
            }

            const displayText = `${city}, ${state}, ${countryCode}`.replace(/, ,/g, ',').replace(/^, |, $/g, '')

            setInputValue(displayText)
            onChange({
              displayText,
              city,
              state,
              country,
              latitude: lat,
              longitude: lon,
            })
          } else {
            throw new Error('Invalid response format')
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error)
          alert('Failed to get location details. Please try typing your location manually.')
        } finally {
          onGettingLocation?.(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Could not get your location. Please enter it manually.')
        onGettingLocation?.(false)
      }
    )
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length >= 3 && suggestions.length > 0 && setIsOpen(true)}
            placeholder="Start typing city name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <MapPinIcon className="w-4 h-4" />
          Detect
        </button>
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {formatLocation(result)}
                  </div>
                  {result.display_name && (
                    <div className="text-xs text-gray-500 truncate">
                      {result.display_name}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-1">
        Type at least 3 characters to search, or click Detect to use your current location
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { ProfileSidebar } from './ProfileSidebar'
import { ProfileLayoutClient } from './ProfileLayoutClient'
import Link from 'next/link'

interface ProfileLayoutWrapperProps {
  userId: string
  signOutAction: () => void
  children: React.ReactNode
}

export function ProfileLayoutWrapper({ userId, signOutAction, children }: ProfileLayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <ProfileSidebar
        userId={userId}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />

      <ProfileLayoutClient>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div className="text-xl font-light text-gray-900">
                Welcome back
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/discover"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Discover
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="px-4 md:px-8 py-8">
          {children}
        </main>
      </ProfileLayoutClient>
    </>
  )
}

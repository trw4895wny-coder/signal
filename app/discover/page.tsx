import { getUser } from '../auth/actions/auth'
import { ProfileLayoutWrapper } from '@/components/profiles/ProfileLayoutWrapper'
import { signOut } from '../auth/actions/auth'
import DiscoverContent from './DiscoverContent'
import Link from 'next/link'

export default async function DiscoverPage() {
  const user = await getUser()

  // If user is signed in, render with sidebar
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfileLayoutWrapper userId={user.id} signOutAction={signOut}>
          <DiscoverContent />
        </ProfileLayoutWrapper>
      </div>
    )
  }

  // If not signed in, render with simple header
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-light">
            Signal
          </Link>
          <div className="flex items-center gap-4">
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
        <DiscoverContent />
      </main>
    </div>
  )
}

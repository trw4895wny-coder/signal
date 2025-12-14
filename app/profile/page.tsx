import { redirect } from 'next/navigation'
import { getUser, signOut } from '../auth/actions/auth'
import { getSignalCategories, getSignalsByCategory, getUserSignals } from '@/lib/signals'
import { ProfileView } from '@/components/profiles/ProfileView'
import { ConnectionRequests } from '@/components/connections/ConnectionRequests'
import Link from 'next/link'

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [categories, signalsByCategory, userSignals] = await Promise.all([
    getSignalCategories(),
    getSignalsByCategory(),
    getUserSignals(user.id),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-light">
            Signal
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/discover"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Discover
            </Link>
            <form action={signOut}>
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

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <ProfileView
          userId={user.id}
          categories={categories}
          signalsByCategory={signalsByCategory}
          userSignals={userSignals}
        />

        <ConnectionRequests userId={user.id} />
      </main>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getUser, signOut } from '../auth/actions/auth'
import { getSignalCategories, getSignalsByCategory, getUserSignals } from '@/lib/signals'
import { SignalSelector } from '@/components/signals/SignalSelector'
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">Your signals</h1>
          <p className="text-gray-600">
            Select up to 5 signals that represent your current professional state
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const signals = signalsByCategory[category.id] || []
            const categoryUserSignals = userSignals.filter(
              (us) => us.signal.category_id === category.id
            )

            return (
              <div key={category.id} className="bg-white rounded-lg p-6 shadow-sm">
                <SignalSelector
                  userId={user.id}
                  categoryId={category.id}
                  categoryName={category.name}
                  signals={signals}
                  userSignals={userSignals}
                />
              </div>
            )
          })}
        </div>

        {userSignals.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Your active signals</h3>
            <div className="flex flex-wrap gap-2">
              {userSignals.map((us) => (
                <span
                  key={us.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  {us.signal.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getUser, signOut } from '../auth/actions/auth'
import Link from 'next/link'
import { ProfileTabs } from '@/components/profiles/ProfileTabs'

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

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
        <ProfileTabs userId={user.id} />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}

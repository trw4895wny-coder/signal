import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from './auth/actions/auth'
import { createClient } from '@/lib/supabase/server'

export default async function Home({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  // Handle email confirmation code
  if (searchParams.code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(searchParams.code)
    redirect('/profile')
  }

  const user = await getUser()

  if (user) {
    redirect('/profile')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-light mb-4">Signal</h1>
        <p className="text-gray-600 mb-8 text-lg">Professional signals, not noise</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="border border-gray-300 px-6 py-3 rounded-md hover:border-gray-400 transition-colors font-medium"
          >
            Sign in
          </Link>
        </div>

        <Link
          href="/discover"
          className="inline-block mt-8 text-gray-600 hover:text-gray-900 text-sm"
        >
          Explore profiles →
        </Link>
      </div>
    </div>
  );
}

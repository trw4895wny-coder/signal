import Link from 'next/link'

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const params = await searchParams
  const email = params.email

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-light mb-2">Check your email</h1>
          {email && (
            <p className="text-gray-600 text-sm mb-4">
              We sent a confirmation link to <strong>{email}</strong>
            </p>
          )}
          <p className="text-gray-600 text-sm">
            Click the link in the email to verify your account and get started.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 mb-6">
          <p className="mb-2">
            <strong>Didn&apos;t receive the email?</strong>
          </p>
          <p>Check your spam folder or wait a few minutes and try again.</p>
        </div>

        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

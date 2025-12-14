export default function ActivityPage() {
  return (
    <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
      <div className="mb-4">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">Activity Feed Coming Soon</h2>
      <p className="text-gray-600">
        Soon you&apos;ll be able to see your recent activity, signal changes, and connection updates here.
      </p>
    </div>
  )
}

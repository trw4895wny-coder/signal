import type { ProfileWithSignals } from '@/types/signals'
import { getDaysUntilExpiration } from '@/types/signals'

interface ProfileCardProps {
  profile: ProfileWithSignals
  onClick?: () => void
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  // Group signals by category
  const signalsByCategory = profile.signals.reduce(
    (acc, userSignal) => {
      const categoryName = userSignal.signal.category.name
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(userSignal)
      return acc
    },
    {} as Record<string, typeof profile.signals>
  )

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
      }`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {profile.full_name || 'Anonymous'}
        </h3>
        <p className="text-sm text-gray-600">{profile.email}</p>
      </div>

      {profile.signals.length > 0 ? (
        <div className="space-y-3">
          {Object.entries(signalsByCategory).map(([categoryName, signals]) => (
            <div key={categoryName}>
              <h4 className="text-xs font-medium text-gray-500 mb-1">
                {categoryName}
              </h4>
              <div className="flex flex-wrap gap-2">
                {signals.map((userSignal) => {
                  const daysLeft = getDaysUntilExpiration(userSignal)
                  return (
                    <span
                      key={userSignal.id}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {userSignal.signal.label}
                      {daysLeft !== null && (
                        <span className="text-xs text-gray-500">
                          ({daysLeft}d)
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No signals set</p>
      )}
    </div>
  )
}

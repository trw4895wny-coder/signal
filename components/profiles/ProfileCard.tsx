import type { ProfileWithSignals } from '@/types/signals'
import { getDaysUntilExpiration } from '@/types/signals'
import { Avatar } from '@/components/ui/Avatar'

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

  const getInitials = () => {
    if (profile.full_name) {
      return profile.full_name[0].toUpperCase()
    }
    if (profile.email) {
      return profile.email[0].toUpperCase()
    }
    return 'A'
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 ${
        onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <Avatar
          src={profile.avatar_url}
          alt={profile.full_name || 'Profile'}
          fallbackText={profile.full_name || profile.email || 'User'}
          size="lg"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {profile.full_name || 'Anonymous'}
          </h3>
          {profile.headline && (
            <p className="text-sm text-gray-600 line-clamp-2">{profile.headline}</p>
          )}
          {profile.location && (
            <p className="text-xs text-gray-500 mt-1">{profile.location}</p>
          )}
        </div>
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

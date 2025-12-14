import { getUser } from '@/app/auth/actions/auth'
import { getProfileWithSignals } from '@/lib/signals'
import { ProfileOverview } from '@/components/profiles/ProfileOverview'
import { redirect } from 'next/navigation'

export default async function OverviewPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const profile = await getProfileWithSignals(user.id)

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : undefined

  return (
    <ProfileOverview
      userId={user.id}
      profile={{
        full_name: profile?.full_name,
        headline: profile?.headline,
        bio: profile?.bio,
        location: profile?.location,
        website: profile?.website,
        avatar_url: profile?.avatar_url,
        email: profile?.email,
        memberSince,
      }}
    />
  )
}

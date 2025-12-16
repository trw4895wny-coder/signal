import { getUser } from '@/app/auth/actions/auth'
import { getProfileWithSignals, getSignalCategories } from '@/lib/signals'
import { ProfileRibbon } from '@/components/profiles/ProfileRibbon'
import { FeedContent } from '@/components/feed/FeedContent'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const supabase = await createClient()

  // Fetch profile with signals
  const profile = await getProfileWithSignals(user.id)

  // Fetch categories and all signals
  const categories = await getSignalCategories()
  const { data: allSignals } = await supabase
    .from('signals')
    .select('*, category:signal_categories(*)')
    .order('display_order', { ascending: true })

  // Group signals by category
  const signalsByCategory: Record<string, any[]> = {}
  allSignals?.forEach((signal: any) => {
    const categoryId = signal.category_id
    if (!signalsByCategory[categoryId]) {
      signalsByCategory[categoryId] = []
    }
    signalsByCategory[categoryId].push(signal)
  })

  // Extract user signals
  const userSignals = profile?.signals || []

  // Fetch connection stats
  const { data: connections } = await (supabase as any)
    .from('connections')
    .select('*')
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)

  const connectionStats = {
    total: connections?.filter((c: any) => c.status === 'accepted').length || 0,
    pending: connections?.filter(
      (c: any) => c.status === 'pending' && c.receiver_id === user.id
    ).length || 0,
    sent: connections?.filter(
      (c: any) => c.status === 'pending' && c.requester_id === user.id
    ).length || 0,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <ProfileRibbon
        userId={user.id}
        profile={{
          full_name: profile?.full_name,
          headline: profile?.headline,
          bio: profile?.bio,
          city: profile?.city,
          state: profile?.state,
          latitude: profile?.latitude,
          longitude: profile?.longitude,
          location: profile?.location,
          website: profile?.website,
          avatar_url: profile?.avatar_url,
          email: profile?.email,
        }}
        userSignals={userSignals}
        connectionStats={connectionStats}
        categories={categories}
        signalsByCategory={signalsByCategory}
      />

      <FeedContent userId={user.id} />
    </div>
  )
}

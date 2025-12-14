import { getUser } from '@/app/auth/actions/auth'
import { getSignalCategories, getSignalsByCategory, getUserSignals } from '@/lib/signals'
import { ProfileSignals } from '@/components/profiles/ProfileSignals'
import { redirect } from 'next/navigation'

export default async function SignalsPage() {
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
    <ProfileSignals
      userId={user.id}
      categories={categories}
      signalsByCategory={signalsByCategory}
      userSignals={userSignals}
    />
  )
}

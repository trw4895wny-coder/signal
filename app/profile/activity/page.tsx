import { getUser } from '@/app/auth/actions/auth'
import { redirect } from 'next/navigation'
import { ActivityContent } from '@/components/activity/ActivityContent'

export default async function ActivityPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <ActivityContent userId={user.id} />
}

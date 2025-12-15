import { getUser } from '@/app/auth/actions/auth'
import { redirect } from 'next/navigation'
import { FeedContent } from '@/components/feed/FeedContent'

export default async function FeedPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <FeedContent userId={user.id} />
}

import { getUser } from '@/app/auth/actions/auth'
import { MessagingHub } from '@/components/messages/MessagingHub'
import { redirect } from 'next/navigation'

export default async function MessagesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <MessagingHub userId={user.id} />
}

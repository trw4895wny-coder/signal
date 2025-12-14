import { getUser } from '@/app/auth/actions/auth'
import { ConnectionRequests } from '@/components/connections/ConnectionRequests'
import { redirect } from 'next/navigation'

export default async function ConnectionsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <ConnectionRequests userId={user.id} />
}

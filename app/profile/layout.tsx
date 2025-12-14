import { redirect } from 'next/navigation'
import { getUser, signOut } from '../auth/actions/auth'
import { ProfileLayoutWrapper } from '@/components/profiles/ProfileLayoutWrapper'

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileLayoutWrapper userId={user.id} signOutAction={signOut}>
        {children}
      </ProfileLayoutWrapper>
    </div>
  )
}

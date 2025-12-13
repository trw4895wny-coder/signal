'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    console.error('Sign up error:', authError.message)
    redirect('/auth/signup?error=true')
  }

  if (authData.user) {
    // Create profile
    const profileData: Database['public']['Tables']['profiles']['Insert'] = {
      id: authData.user.id,
      email,
      full_name: fullName,
    }

    // @ts-ignore - Supabase type inference issue
    const { error: profileError } = await supabase.from('profiles').insert(profileData)

    if (profileError) {
      console.error('Profile creation error:', profileError.message)
      redirect('/auth/signup?error=true')
    }
  }

  redirect('/profile')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error.message)
    redirect('/auth/login?error=true')
  }

  redirect('/profile')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch all profiles except the current user
  const query = supabase
    .from('profiles')
    .select(`
      *,
      signals:user_signals(
        *,
        signal:signals(
          *,
          category:signal_categories(*)
        )
      )
    `)

  // If user is authenticated, exclude their profile
  if (user) {
    query.neq('id', user.id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

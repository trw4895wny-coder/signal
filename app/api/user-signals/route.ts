import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/user-signals - Get user's active signals
export async function GET(request: Request) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const { data: userSignals, error } = await (supabase as any)
      .from('user_signals')
      .select(`
        *,
        signal:signal_id(
          id,
          name,
          category_id,
          category:category_id(name)
        )
      `)
      .eq('user_id', userId)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

    if (error) throw error

    return NextResponse.json(userSignals)
  } catch (error: any) {
    console.error('Error fetching user signals:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

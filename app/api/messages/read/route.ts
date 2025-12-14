import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/messages/read - Mark messages as read
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { connection_id } = await request.json()

  if (!connection_id) {
    return NextResponse.json(
      { error: 'connection_id is required' },
      { status: 400 }
    )
  }

  // Mark all unread messages in this connection as read
  // Only mark messages where the user is NOT the sender
  const { error } = await (supabase as any)
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('connection_id', connection_id)
    .neq('sender_id', user.id)
    .is('read_at', null)

  if (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

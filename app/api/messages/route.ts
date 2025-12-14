import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/messages?connection_id=xxx - Get messages for a connection
export async function GET(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const connectionId = searchParams.get('connection_id')

  if (!connectionId) {
    return NextResponse.json(
      { error: 'connection_id is required' },
      { status: 400 }
    )
  }

  // Verify user is part of this connection
  const { data: connection } = await (supabase as any)
    .from('connections')
    .select('*')
    .eq('id', connectionId)
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .eq('status', 'accepted')
    .single()

  if (!connection) {
    return NextResponse.json(
      { error: 'Connection not found or not authorized' },
      { status: 404 }
    )
  }

  // Get messages for this connection
  const { data: messages, error } = await (supabase as any)
    .from('messages')
    .select(`
      *,
      sender:sender_id(id, email, full_name, avatar_url)
    `)
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(messages || [])
}

// POST /api/messages - Send a message
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { connection_id, content } = await request.json()

  if (!connection_id || !content) {
    return NextResponse.json(
      { error: 'connection_id and content are required' },
      { status: 400 }
    )
  }

  // Verify connection exists and is accepted
  const { data: connection } = await (supabase as any)
    .from('connections')
    .select('*')
    .eq('id', connection_id)
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .eq('status', 'accepted')
    .single()

  if (!connection) {
    return NextResponse.json(
      { error: 'Connection not found or not accepted' },
      { status: 404 }
    )
  }

  // Create message
  const { data: message, error } = await (supabase as any)
    .from('messages')
    .insert({
      connection_id,
      sender_id: user.id,
      content,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(message, { status: 201 })
}

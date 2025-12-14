import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/connections - Get user's connections and pending requests
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all connections where user is involved
  const { data: connections, error } = await (supabase as any)
    .from('connections')
    .select(`
      *,
      requester:requester_id(id, email, full_name),
      receiver:receiver_id(id, email, full_name)
    `)
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(connections)
}

// POST /api/connections - Send a connection request
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { receiver_id } = await request.json()

  if (!receiver_id) {
    return NextResponse.json(
      { error: 'receiver_id is required' },
      { status: 400 }
    )
  }

  // Check if connection already exists (in either direction)
  const { data: existing } = await (supabase as any)
    .from('connections')
    .select('*')
    .or(
      `and(requester_id.eq.${user.id},receiver_id.eq.${receiver_id}),and(requester_id.eq.${receiver_id},receiver_id.eq.${user.id})`
    )
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'Connection already exists' },
      { status: 400 }
    )
  }

  // Create connection request
  const { data: connection, error } = await (supabase as any)
    .from('connections')
    .insert({
      requester_id: user.id,
      receiver_id,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(connection, { status: 201 })
}

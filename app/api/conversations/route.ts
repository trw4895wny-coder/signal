import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/conversations - Get all user's conversations with last message
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all accepted connections
  const { data: connections, error: connectionsError } = await (supabase as any)
    .from('connections')
    .select(`
      id,
      requester_id,
      receiver_id,
      created_at,
      requester:requester_id(id, email, full_name, headline, avatar_url),
      receiver:receiver_id(id, email, full_name, headline, avatar_url)
    `)
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)

  if (connectionsError) {
    return NextResponse.json({ error: connectionsError.message }, { status: 500 })
  }

  if (!connections || connections.length === 0) {
    return NextResponse.json([])
  }

  // For each connection, get the last message and unread count
  const conversationsWithMessages = await Promise.all(
    connections.map(async (connection: any) => {
      // Get last message for this connection
      const { data: lastMessage } = await (supabase as any)
        .from('messages')
        .select('*')
        .eq('connection_id', connection.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Count unread messages (messages from other person that user hasn't read)
      const otherUserId =
        connection.requester_id === user.id
          ? connection.receiver_id
          : connection.requester_id

      const { count: unreadCount } = await (supabase as any)
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('connection_id', connection.id)
        .eq('sender_id', otherUserId)
        .is('read_at', null)

      // Determine the other user
      const otherUser =
        connection.requester_id === user.id
          ? connection.receiver
          : connection.requester

      return {
        connection_id: connection.id,
        other_user: otherUser,
        last_message: lastMessage || null,
        unread_count: unreadCount || 0,
        created_at: connection.created_at,
        // For sorting, use last message time or connection creation time
        last_activity: lastMessage?.created_at || connection.created_at,
      }
    })
  )

  // Sort by most recent activity
  conversationsWithMessages.sort(
    (a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
  )

  return NextResponse.json(conversationsWithMessages)
}

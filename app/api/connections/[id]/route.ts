import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// PATCH /api/connections/:id - Accept or reject a connection request
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()

  if (!status || !['accepted', 'rejected'].includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status. Must be "accepted" or "rejected"' },
      { status: 400 }
    )
  }

  // Update connection status (RLS ensures only receiver can update)
  const { data: connection, error } = await (supabase as any)
    .from('connections')
    .update({ status })
    .eq('id', id)
    .eq('receiver_id', user.id) // Ensure user is the receiver
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!connection) {
    return NextResponse.json(
      { error: 'Connection not found or not authorized' },
      { status: 404 }
    )
  }

  return NextResponse.json(connection)
}

// DELETE /api/connections/:id - Remove a connection
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Delete connection (only if user is part of it)
  const { error } = await (supabase as any)
    .from('connections')
    .delete()
    .eq('id', id)
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

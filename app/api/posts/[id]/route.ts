import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// PATCH /api/posts/[id] - Update a post
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

  try {
    const body = await request.json()
    const { content, post_type, signal_ids } = body

    // Verify post ownership
    const { data: existingPost, error: fetchError } = await (supabase as any)
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update post
    const updateData: any = { updated_at: new Date().toISOString() }
    if (content !== undefined) updateData.content = content
    if (post_type !== undefined) updateData.post_type = post_type

    const { data: post, error: updateError } = await (supabase as any)
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // Update signals if provided
    if (signal_ids !== undefined) {
      // Delete existing signal links
      await (supabase as any)
        .from('post_signals')
        .delete()
        .eq('post_id', id)

      // Insert new signal links
      if (signal_ids.length > 0) {
        const signalLinks = signal_ids.map((signal_id: string) => ({
          post_id: id,
          signal_id,
        }))

        const { error: signalError } = await (supabase as any)
          .from('post_signals')
          .insert(signalLinks)

        if (signalError) throw signalError
      }
    }

    return NextResponse.json(post)
  } catch (error: any) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/posts/[id] - Delete a post
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

  try {
    // Verify post ownership
    const { data: existingPost, error: fetchError } = await (supabase as any)
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (existingPost.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete post (cascade will handle post_signals, reactions, comments)
    const { error: deleteError } = await (supabase as any)
      .from('posts')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

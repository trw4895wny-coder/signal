import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { filterPostsByDistance } from '@/lib/distance'

// GET /api/posts - Get smart-matched feed
export async function GET(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const feedType = searchParams.get('type') || 'smart' // 'smart', 'connections', 'own'
  const distanceParam = searchParams.get('distance') // Distance in miles

  try {
    // Get user's profile for location filtering
    let userProfile = null
    if (distanceParam) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', user.id)
        .single()

      userProfile = profile
    }

    if (feedType === 'own') {
      // Get user's own posts
      const { data: posts, error } = await (supabase as any)
        .from('posts')
        .select(`
          *,
          user:user_id(id, email, full_name, headline, avatar_url),
          post_signals(
            signal:signal_id(id, label, category_id)
          ),
          post_reactions(id, reaction_type, user_id),
          post_comments(id)
        `)
        .eq('user_id', user.id)
        .eq('archived', false)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      return NextResponse.json(
        posts.map((post: any) => ({
          ...post,
          reaction_count: post.post_reactions?.length || 0,
          comment_count: post.post_comments?.length || 0,
        }))
      )
    }

    // Get user's active signals for smart matching
    const { data: userSignals } = await (supabase as any)
      .from('user_signals')
      .select('signal_id, signal:signal_id(id, label, category_id)')
      .eq('user_id', user.id)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

    const userSignalIds = userSignals?.map((us: any) => us.signal_id) || []

    // Get connections
    const { data: connections } = await (supabase as any)
      .from('connections')
      .select('requester_id, receiver_id')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)

    const connectionUserIds = connections?.map((c: any) =>
      c.requester_id === user.id ? c.receiver_id : c.requester_id
    ) || []

    // Fetch all posts with user and signal info (including user's own posts)
    const { data: allPosts, error } = await (supabase as any)
      .from('posts')
      .select(`
        *,
        user:user_id(id, email, full_name, headline, avatar_url),
        post_signals(
          signal:signal_id(id, label, category_id)
        ),
        post_reactions(id, reaction_type, user_id),
        post_comments(id)
      `)
      .eq('archived', false)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Smart matching algorithm
    interface ScoredPost {
      [key: string]: any
      match_score: number
      match_reason: string
    }

    const scoredPosts = allPosts.map((post: any): ScoredPost => {
      let score = 0
      let matchReason = ''

      // Boost user's own posts (especially recent ones)
      if (post.user_id === user.id) {
        const ageInHours = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60)
        if (ageInHours < 24) {
          score += 50 // Very high boost for posts less than 24 hours old
          matchReason = 'Your post'
        } else {
          score += 10 // Still boost older own posts
          matchReason = 'Your post'
        }
      }

      // Score based on signal overlap
      const postSignalIds = post.post_signals?.map((ps: any) => ps.signal.id) || []
      const signalOverlap = postSignalIds.filter((id: string) => userSignalIds.includes(id))

      if (signalOverlap.length > 0) {
        score += signalOverlap.length * 10
        if (!matchReason) matchReason = `Matches your "${post.post_signals[0]?.signal?.label}" signal`
      }

      // Boost connection posts
      if (connectionUserIds.includes(post.user_id)) {
        score += 5
        if (!matchReason) matchReason = 'From your connections'
      }

      // Boost help requests
      if (post.post_type === 'help_request') {
        score += 3
        if (!matchReason) matchReason = 'Help request'
      }

      // Recency boost
      const ageInDays = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60 * 24)
      score += Math.max(0, 5 - ageInDays)

      return {
        ...post,
        match_score: score,
        match_reason: matchReason || 'Suggested for you',
        reaction_count: post.post_reactions?.length || 0,
        comment_count: post.post_comments?.length || 0,
      }
    })

    // Sort by match score
    scoredPosts.sort((a: ScoredPost, b: ScoredPost) => b.match_score - a.match_score)

    // Filter based on feed type
    let filteredPosts = scoredPosts
    if (feedType === 'connections') {
      filteredPosts = scoredPosts.filter((p: ScoredPost) => connectionUserIds.includes(p.user_id))
    }

    // Apply distance filter if requested
    if (distanceParam && userProfile?.latitude && userProfile?.longitude) {
      const maxDistance = parseInt(distanceParam, 10)
      filteredPosts = filterPostsByDistance(
        filteredPosts,
        userProfile.latitude,
        userProfile.longitude,
        maxDistance
      )
    }

    return NextResponse.json(filteredPosts.slice(0, 50))
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { content, post_type, visibility, signal_ids, expires_in_days } = body

    if (!content || !post_type) {
      return NextResponse.json(
        { error: 'content and post_type are required' },
        { status: 400 }
      )
    }

    // Get user's profile for location
    const { data: profile } = await supabase
      .from('profiles')
      .select('city, state, country, latitude, longitude')
      .eq('id', user.id)
      .single()

    // Calculate expiration
    let expires_at = null
    if (expires_in_days && expires_in_days > 0) {
      expires_at = new Date()
      expires_at.setDate(expires_at.getDate() + expires_in_days)
    }

    // Create post with user's location
    const { data: post, error: postError } = await (supabase as any)
      .from('posts')
      .insert({
        user_id: user.id,
        content,
        post_type,
        visibility: visibility || 'public',
        expires_at,
        city: profile?.city,
        state: profile?.state,
        country: profile?.country,
        latitude: profile?.latitude,
        longitude: profile?.longitude,
      })
      .select()
      .single()

    if (postError) throw postError

    // Link signals if provided
    if (signal_ids && signal_ids.length > 0) {
      const signalLinks = signal_ids.map((signal_id: string) => ({
        post_id: post.id,
        signal_id,
      }))

      const { error: signalError } = await (supabase as any)
        .from('post_signals')
        .insert(signalLinks)

      if (signalError) throw signalError
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

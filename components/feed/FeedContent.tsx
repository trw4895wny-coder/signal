'use client'

import { useEffect, useState, useCallback } from 'react'
import { CreatePost } from './CreatePost'
import { PostCard } from './PostCard'
import { FloatingActionButton } from './FloatingActionButton'
import { QuickPostTemplates } from './QuickPostTemplates'
import { SparklesIcon } from '@heroicons/react/24/outline'

interface FeedContentProps {
  userId: string
}

interface Signal {
  id: string
  label: string
  category_id: string
}

interface Post {
  id: string
  content: string
  post_type: string
  created_at: string
  match_score?: number
  match_reason?: string
  reaction_count: number
  comment_count: number
  user: {
    id: string
    email: string
    full_name: string | null
    headline: string | null
    avatar_url: string | null
  }
  post_signals?: Array<{
    signal: {
      id: string
      label: string
    }
  }>
}

export function FeedContent({ userId }: FeedContentProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [userSignals, setUserSignals] = useState<Signal[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [feedType, setFeedType] = useState<'smart' | 'connections'>('smart')
  const [showQuickPost, setShowQuickPost] = useState(false)

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts?type=${feedType}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [feedType])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    // Fetch user signals and profile
    async function fetchUserData() {
      try {
        const [signalsRes, profileRes] = await Promise.all([
          fetch(`/api/user-signals?userId=${userId}`),
          fetch(`/api/profiles/${userId}`)
        ])

        if (signalsRes.ok) {
          const data = await signalsRes.json()
          setUserSignals(data.map((us: any) => us.signal))
        }

        if (profileRes.ok) {
          const profile = await profileRes.json()
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [userId])

  const handlePostCreated = () => {
    fetchPosts()
  }

  const handleRefresh = () => {
    fetchPosts()
  }

  // Separate high-relevance posts
  const relevantPosts = posts.filter(p => (p.match_score || 0) >= 10)
  const otherPosts = posts.filter(p => (p.match_score || 0) < 10)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Create Post */}
      <CreatePost userId={userId} onPostCreated={handlePostCreated} />

      {/* Feed Type Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFeedType('smart')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              feedType === 'smart'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SparklesIcon className="w-4 h-4 inline mr-2" />
            Smart Feed
          </button>
          <button
            onClick={() => setFeedType('connections')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              feedType === 'connections'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Connections
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
          <div className="text-gray-600">Loading feed...</div>
        </div>
      ) : (
        <>
          {/* Highly Relevant Posts */}
          {feedType === 'smart' && relevantPosts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-sm font-medium text-gray-900">
                  Highly relevant to your signals
                </h2>
              </div>
              {relevantPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={userId}
                  userSignals={userSignals}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          )}

          {/* Other Posts */}
          {otherPosts.length > 0 && (
            <div className="space-y-4">
              {feedType === 'smart' && relevantPosts.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h2 className="text-sm font-medium text-gray-600 px-2 mb-4">
                    More posts
                  </h2>
                </div>
              )}
              {otherPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={userId}
                  userSignals={userSignals}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
              <SparklesIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">No posts yet</p>
              <p className="text-sm text-gray-500">
                {feedType === 'smart'
                  ? 'Posts will appear here based on your signals and interests'
                  : 'Connect with people to see their posts'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowQuickPost(true)} />

      {/* Quick Post Templates Modal */}
      {showQuickPost && userProfile && (
        <QuickPostTemplates
          userId={userId}
          userSignals={userSignals}
          userProfile={userProfile}
          onClose={() => setShowQuickPost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  )
}

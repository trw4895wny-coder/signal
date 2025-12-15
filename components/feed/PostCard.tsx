'use client'

import { Avatar } from '@/components/ui/Avatar'
import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid'

interface PostCardProps {
  post: {
    id: string
    content: string
    post_type: string
    created_at: string
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
        name: string
      }
    }>
  }
  currentUserId: string
}

export function PostCard({ post }: PostCardProps) {
  const postTypeColors = {
    update: 'bg-blue-50 text-blue-700 border-blue-200',
    help_request: 'bg-orange-50 text-orange-700 border-orange-200',
    offering_help: 'bg-green-50 text-green-700 border-green-200',
    project: 'bg-purple-50 text-purple-700 border-purple-200',
    collaboration: 'bg-pink-50 text-pink-700 border-pink-200',
  }

  const postTypeLabels = {
    update: 'Update',
    help_request: 'Need Help',
    offering_help: 'Offering Help',
    project: 'Project',
    collaboration: 'Collaboration',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Match Reason Banner */}
      {post.match_reason && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
          <SparklesIcon className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-700">{post.match_reason}</span>
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar
          src={post.user.avatar_url}
          alt={post.user.full_name || 'User'}
          fallbackText={post.user.full_name || post.user.email}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">
            {post.user.full_name || 'Anonymous'}
          </h3>
          {post.user.headline && (
            <p className="text-sm text-gray-600 truncate">{post.user.headline}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Post Type Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            postTypeColors[post.post_type as keyof typeof postTypeColors]
          }`}
        >
          {postTypeLabels[post.post_type as keyof typeof postTypeLabels]}
        </span>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Signal Tags */}
      {post.post_signals && post.post_signals.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.post_signals.map((ps) => (
            <span
              key={ps.signal.id}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {ps.signal.name}
            </span>
          ))}
        </div>
      )}

      {/* Engagement Bar */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group">
          <HandThumbUpIcon className="w-5 h-5 group-hover:hidden" />
          <HandThumbUpSolidIcon className="w-5 h-5 hidden group-hover:block text-blue-600" />
          <span className="text-sm">{post.reaction_count}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ChatBubbleLeftIcon className="w-5 h-5" />
          <span className="text-sm">{post.comment_count}</span>
        </button>
      </div>
    </div>
  )
}

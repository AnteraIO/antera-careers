import { Link } from 'react-router-dom'
import { Calendar, Clock, Eye, ArrowUp, ArrowDown, MessageSquare } from 'lucide-react'
import { Post } from '@/types'
import { formatDate, estimateReadingTime } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'

interface PostCardProps {
  post: Post
}

export function PostCard({ post: initialPost }: PostCardProps) {
  const [post, setPost] = useState(initialPost)
  const [hasVoted, setHasVoted] = useState<string | null>(null)

  useEffect(() => {
    setHasVoted(localStorage.getItem(`voted_${post.id}`))
  }, [post.id])

  const voteCount = (post.upvotes || 0) - (post.downvotes || 0)

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasVoted) return
    try {
      const { error } = await supabase.rpc('upvote_post', { post_id: post.id })
      if (!error) {
        setPost(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }))
        localStorage.setItem(`voted_${post.id}`, 'up')
        setHasVoted('up')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownvote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasVoted) return
    try {
      const { error } = await supabase.rpc('downvote_post', { post_id: post.id })
      if (!error) {
        setPost(prev => ({ ...prev, downvotes: (prev.downvotes || 0) + 1 }))
        localStorage.setItem(`voted_${post.id}`, 'down')
        setHasVoted('down')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Link to={`/post/${post.slug}`} className="block group">
      <div className="border border-neutral-200 bg-white hover:border-black transition-colors duration-200">
        <div className="p-6 md:p-8">
          {/* Header with metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-700">post</span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {post.tags?.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-black text-white border border-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-3 group-hover:text-[#FA520F] transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-base text-neutral-500 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold uppercase text-neutral-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {estimateReadingTime(post.content)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                {post.views || 0}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" />
                discuss
              </span>
            </div>

            {/* Vote buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleUpvote(e)
                }}
                className={`p-1.5 border border-neutral-200 transition-all ${
                  hasVoted === 'up' 
                    ? 'border-[#FA520F] bg-[#FA520F] text-white' 
                    : 'border-neutral-200 text-neutral-700 hover:border-black hover:text-black'
                }`}
                disabled={!!hasVoted}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-bold text-black min-w-[20px] text-center">
                {voteCount}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleDownvote(e)
                }}
                className={`p-1.5 border border-neutral-200 transition-all ${
                  hasVoted === 'down' 
                    ? 'border-black bg-black text-white' 
                    : 'border-neutral-200 text-neutral-700 hover:border-black hover:text-black'
                }`}
                disabled={!!hasVoted}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Status indicator */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold uppercase text-neutral-700">
              {estimateReadingTime(post.content)} min read
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
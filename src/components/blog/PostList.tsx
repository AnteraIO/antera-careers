
import { PostCard } from './PostCard'
import { Post } from '@/types'

interface PostListProps {
  posts: Post[]
  loading?: boolean
}

export function PostList({ posts, loading }: PostListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-neutral-200 bg-white">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div 
            key={i} 
            className={`border-b ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'md:border-b' : ''} border-neutral-200 p-8 md:p-12 animate-pulse`}
          >
            <div className="aspect-video bg-neutral-200 border border-neutral-200 mb-8" />
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-4 w-12 bg-neutral-200" />
                <div className="h-4 w-16 bg-neutral-200" />
              </div>
              <div className="h-8 bg-neutral-200 w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 w-full" />
                <div className="h-4 bg-neutral-200 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-neutral-200">
        <p className="font-mono text-neutral-700">No posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-neutral-200 bg-white">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className={`group border-b ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'md:border-b' : ''} border-neutral-200 hover:bg-neutral-50/50 transition-colors`}
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  )
}
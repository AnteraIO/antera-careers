import { usePosts } from '@/hooks/usePosts'
import { SearchBar } from '@/components/common/SearchBar'
import { TagFilter } from '@/components/common/TagFilter'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export function BlogPage() {
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const pageSize = 6
  const { posts, totalCount, loading } = usePosts(page, pageSize)

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('tags')
          .eq('published', true)
        
        if (!error && data) {
          const tagSet = new Set<string>()
          data.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
              post.tags.forEach((tag: string) => tagSet.add(tag))
            }
          })
          setAllTags(Array.from(tagSet).sort())
        }
      } catch (err) {
        console.error('Error fetching tags:', err)
      } finally {
        setTagsLoading(false)
      }
    }
    
    fetchAllTags()
  }, [])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="bg-[#FAFAF8] text-black min-h-screen selection:bg-[#FA520F] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Header */}
        <header className="mb-24 md:mb-40 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-normal tracking-[-0.03em] leading-[0.95] mb-6">
            Welcome to my blog.
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed text-neutral-500 mx-auto">
            {totalCount} posts. Sharing thoughts and technical stuff.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-12">
          {/* Mobile filter button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full flex items-center justify-between border-4 border-black bg-transparent px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters & Search
              </span>
              {mobileFiltersOpen ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {mobileFiltersOpen && (
              <div className="mt-4 p-6 border-4 border-black bg-white space-y-4">
                <SearchBar />
                <TagFilter tags={allTags} loading={tagsLoading} />
              </div>
            )}
          </div>

          {/* Desktop filters */}
          <div className="hidden sm:block">
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-6 border-4 border-black bg-white">
              <SearchBar />
              <TagFilter tags={allTags} loading={tagsLoading} />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-neutral-200 bg-white">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className={`group border-b ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'md:border-b' : ''} border-neutral-200 hover:bg-neutral-50/50 transition-colors`}
            >
              <a href={`/post/${post.slug}`} className="block p-8 md:p-12 min-h-[420px] flex flex-col justify-between">
                {post.cover_image && (
                  <div className="aspect-video relative border border-neutral-200 overflow-hidden mb-8 bg-neutral-100">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 bg-black text-white">Read</span>
                    <span className="text-[10px] font-mono text-neutral-700 uppercase">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-3 group-hover:text-[#FA520F] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-base text-neutral-500 leading-relaxed line-clamp-3">
                    {post.excerpt?.replace(/^(?:TITLE|EXCERPT|CONTENT):\s*/gi, '').trim() ||
                     post.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-20 border border-dashed border-neutral-200">
            <p className="font-mono text-neutral-700">No articles found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-neutral-200">
            <div className="text-[10px] font-mono uppercase text-neutral-700">
              {totalCount} total posts
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative border-4 border-black bg-transparent px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-30 disabled:active:translate-x-0 disabled:active:translate-y-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = []
                  const maxVisible = 5
                  let startPage = Math.max(1, page - Math.floor(maxVisible / 2))
                  const endPage = Math.min(totalPages, startPage + maxVisible - 1)
                  
                  if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1)
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`relative border-4 border-black px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${
                          page === i 
                            ? 'bg-[#FA520F] text-white shadow-[4px_4px_0px_0px_#000000]' 
                            : 'bg-transparent text-black shadow-[4px_4px_0px_0px_#000000] hover:bg-black hover:text-white'
                        }`}
                      >
                        {i}
                      </button>
                    )
                  }
                  return pages
                })()}
              </div>
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative border-4 border-black bg-transparent px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-75 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-30 disabled:active:translate-x-0 disabled:active:translate-y-0"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-[10px] font-mono uppercase text-neutral-700">
              Page {page} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
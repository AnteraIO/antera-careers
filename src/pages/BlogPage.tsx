import { useJobs } from '@/hooks/useJobs'
import { SearchBar } from '@/components/common/SearchBar'
import { TagFilter } from '@/components/common/TagFilter'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Filter, X, MapPin, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export function BlogPage() {
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const pageSize = 6
  const { jobs, totalCount, loading } = useJobs(page, pageSize)

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('tags')
          .eq('published', true)
        
        if (!error && data) {
          const tagSet = new Set<string>()
          data.forEach(job => {
            if (job.tags && Array.isArray(job.tags)) {
              job.tags.forEach((tag: string) => tagSet.add(tag))
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
            Join the Antera Team.
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed text-neutral-500 mx-auto">
            {totalCount} active job openings. Help us innovate machine learning for low-resource languages.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-12">
          {/* Mobile filter button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full flex items-center justify-between bg-[#FA520F] hover:bg-black text-white px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-[#FA520F] hover:border-black"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters & Search
              </span>
              {mobileFiltersOpen ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {mobileFiltersOpen && (
              <div className="mt-4 p-6 border-2 border-neutral-200 bg-white space-y-4">
                <SearchBar />
                <TagFilter tags={allTags} loading={tagsLoading} />
              </div>
            )}
          </div>

          {/* Desktop filters */}
          <div className="hidden sm:block">
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-6 border-2 border-neutral-200 bg-white">
              <SearchBar />
              <TagFilter tags={allTags} loading={tagsLoading} />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-neutral-200 bg-white">
          {jobs.map((job, i) => (
            <div
              key={job.id}
              className={`group border-b ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'md:border-b' : ''} border-neutral-200 hover:bg-neutral-50/50 transition-colors`}
            >
              <a href={`/job/${job.slug}`} className="block p-8 md:p-12 min-h-[420px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-1 bg-[#FA520F] text-white">
                      {job.employment_type}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-700 uppercase">
                      {job.department}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-3 group-hover:text-[#FA520F] transition-colors">
                    {job.title}
                  </h2>
                  <p className="text-base text-neutral-500 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-200 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-700">
                    <MapPin className="h-3.5 w-3.5 text-[#FA520F]" />
                    <span>{job.location}</span>
                  </div>
                  {job.experience_level && (
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-neutral-700">
                      <Briefcase className="h-3.5 w-3.5 text-[#FA520F]" />
                      <span>{job.experience_level}</span>
                    </div>
                  )}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 border border-neutral-300 text-neutral-600 bg-neutral-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-20 border border-dashed border-neutral-200">
            <p className="font-mono text-neutral-700">No career opportunities found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-neutral-200">
            <div className="text-[10px] font-mono uppercase text-neutral-700">
              {totalCount} total openings
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white hover:bg-neutral-100 text-black px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-neutral-300 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed"
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
                        className={`px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 ${
                          page === i 
                            ? 'bg-[#FA520F] text-white border-[#FA520F]' 
                            : 'bg-white text-black border-neutral-300 hover:border-black hover:bg-neutral-100'
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
                className="bg-white hover:bg-neutral-100 text-black px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-2 border-neutral-300 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed"
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
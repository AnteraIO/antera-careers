import { useFilterStore } from '@/store/filterStore'
import { cn } from '@/lib/utils'
import { Hash, X } from 'lucide-react'

interface TagFilterProps {
  tags: string[]
  loading?: boolean
}

export function TagFilter({ tags, loading }: TagFilterProps) {
  const { selectedTags, toggleTag, clearFilters } = useFilterStore()

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-mono font-bold uppercase text-neutral-700">loading tags...</span>
      </div>
    )
  }

  // Don't render if no tags
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex items-center gap-1.5 mr-1">
        <Hash className="h-3 w-3 text-neutral-700" />
        <span className="text-[10px] font-mono font-bold uppercase text-neutral-700">tags</span>
        <span className="text-neutral-300 mx-1">|</span>
      </div>

      {/* Tag buttons */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={cn(
              "px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-all duration-150 border-2",
              selectedTags.includes(tag)
                ? "bg-[#FA520F] text-white border-[#FA520F]"
                : "bg-transparent text-neutral-700 border-neutral-200 hover:border-black hover:text-black"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Clear filters button */}
      {selectedTags.length > 0 && (
        <button
          onClick={clearFilters}
          className="ml-1 p-1 text-neutral-700 hover:text-black transition-colors border-2 border-transparent hover:border-black"
          aria-label="Clear all filters"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
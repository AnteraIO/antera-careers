import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useFilterStore } from '@/store/filterStore'

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounce search input to avoid excessive filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, setSearchQuery])

  // Clear search input
  const clearSearch = () => {
    setLocalQuery('')
    setSearchQuery('')
  }

  return (
    <div className="relative w-full">
      <div className="relative border-4 border-black bg-white">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5 text-neutral-700" />
        </div>
        
        {/* Search input */}
        <input
          type="text"
          placeholder="search posts..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-transparent text-black placeholder:text-neutral-700 font-mono text-sm focus:outline-none"
        />
        
        {/* Clear button - only show when there's text */}
        {localQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-black transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      
      {/* Search hint - optional */}
      {!localQuery && (
        <div className="mt-1 text-[9px] font-mono font-bold uppercase text-neutral-700 pointer-events-none">
          press / to search
        </div>
      )}
    </div>
  )
}
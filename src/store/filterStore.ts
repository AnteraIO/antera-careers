import { create } from 'zustand'

interface FilterState {
  selectedTags: string[]
  searchQuery: string
  setSelectedTags: (tags: string[]) => void
  toggleTag: (tag: string) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedTags: [],
  searchQuery: '',
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter((t) => t !== tag)
      : [...state.selectedTags, tag],
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () => set({ selectedTags: [], searchQuery: '' }),
}))

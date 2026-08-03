import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Post } from '@/types'
import { useFilterStore } from '@/store/filterStore'

export function usePosts(page: number = 1, pageSize: number = 6) {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedTags, searchQuery } = useFilterStore()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags)
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`)
      }

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError
      setPosts(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedTags, searchQuery, page])

  return { posts, totalCount, loading, error, refetch: fetchPosts }
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single()

        if (fetchError) throw fetchError
        setPost(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchPost()
  }, [slug])

  const incrementViews = async () => {
    if (!post) return
    const sessionKey = `viewed_${post.id}`
    if (sessionStorage.getItem(sessionKey)) return

    try {
      const { error: updateError } = await supabase.rpc('increment_views', { post_id: post.id })
      if (!updateError) {
        sessionStorage.setItem(sessionKey, 'true')
        setPost(prev => prev ? { ...prev, views: prev.views + 1 } : null)
      }
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  const upvote = async () => {
    if (!post) return
    try {
      const { error: updateError } = await supabase.rpc('upvote_post', { post_id: post.id })
      if (!updateError) {
        setPost(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null)
      }
    } catch (err) {
      console.error('Error upvoting:', err)
    }
  }

  const downvote = async () => {
    if (!post) return
    try {
      const { error: updateError } = await supabase.rpc('downvote_post', { post_id: post.id })
      if (!updateError) {
        setPost(prev => prev ? { ...prev, downvotes: prev.downvotes + 1 } : null)
      }
    } catch (err) {
      console.error('Error downvoting:', err)
    }
  }

  return { post, loading, error, incrementViews, upvote, downvote }
}

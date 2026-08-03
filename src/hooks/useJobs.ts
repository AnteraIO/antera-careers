import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Job } from '@/types'
import { useFilterStore } from '@/store/filterStore'

export function useJobs(page: number = 1, pageSize: number = 6) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedTags, searchQuery } = useFilterStore()

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags)
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,department.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
      }

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError
      setJobs(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [selectedTags, searchQuery, page])

  return { jobs, totalCount, loading, error, refetch: fetchJobs }
}

export function useJob(slug: string) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('slug', slug)
          .single()

        if (fetchError) throw fetchError
        setJob(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchJob()
  }, [slug])

  const incrementViews = async () => {
    if (!job) return
    const sessionKey = `viewed_job_${job.id}`
    if (sessionStorage.getItem(sessionKey)) return

    try {
      const { error: updateError } = await supabase.rpc('increment_job_views', { job_id: job.id })
      if (!updateError) {
        sessionStorage.setItem(sessionKey, 'true')
        setJob(prev => prev ? { ...prev, views: prev.views + 1 } : null)
      }
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  return { job, loading, error, incrementViews }
}

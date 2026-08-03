import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { setUser, setSession, setLoading, user, session, loading, signOut } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setSession, setUser, setLoading])

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'
  const isAdmin = user?.email?.toLowerCase() === adminEmail.toLowerCase()

  return { user, session, loading, isAdmin, signOut }
}

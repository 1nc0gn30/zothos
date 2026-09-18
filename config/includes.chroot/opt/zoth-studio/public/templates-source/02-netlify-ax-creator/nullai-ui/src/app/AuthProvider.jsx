import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(false)

  /* ============================
     AUTH SESSION
  ============================ */
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) console.error('Session error:', error)

      setUser(data?.session?.user ?? null)
      setAccessToken(data?.session?.access_token ?? null)
      setLoadingAuth(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAccessToken(session?.access_token ?? null)
      setLoadingAuth(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  /* ============================
     PROFILE FETCH
  ============================ */
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const loadProfile = async () => {
      setLoadingProfile(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Profile fetch error:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }

      setLoadingProfile(false)
    }

    loadProfile()
  }, [user])

  const loading = loadingAuth || loadingProfile
  const tier = profile?.tier ?? 'free'

  const value = {
    user,
    profile,
    accessToken,
    loading,

    // 🔒 BACKWARD COMPAT (THIS FIXES THE CRASH)
    isAuthenticated: !!user,
    hasAccess: !!profile?.access_enabled || tier === 'free',
    tier,
    isPaid: tier !== 'free',
    isWaitlisted: !!profile?.waitlisted,

    async signOut() {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setAccessToken(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
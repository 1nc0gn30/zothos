import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const PROFILE_STORAGE_KEY = 'nullai-profile'
const DEFAULT_PROFILE = {
  id: 'local-operator',
  email: 'operator@nullai.local',
  avatar_url: '',
  operator_signature: 'LOCAL_OP',
  bio: '',
  motto: '',
  skills: ['OPS_READ', 'SANDBOX'],
  tier: 'free',
  waitlisted: false,
  access_enabled: true,
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)

  const user = useMemo(
    () => ({
      id: profile.id,
      email: profile.email,
    }),
    [profile.id, profile.email]
  )

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setProfile({ ...DEFAULT_PROFILE, ...parsed })
      }
    } catch (error) {
      console.error('Failed loading local operator profile:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = (nextProfile) => {
    const merged = { ...DEFAULT_PROFILE, ...nextProfile }
    setProfile(merged)
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged))
  }

  const tier = profile?.tier ?? 'free'

  const value = {
    user,
    profile,
    loading,
    accessToken: null,
    isAuthenticated: true,
    hasAccess: !!profile?.access_enabled || tier === 'free',
    tier,
    isPaid: tier !== 'free',
    isWaitlisted: !!profile?.waitlisted,
    refreshProfile() {
      try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw)
        setProfile({ ...DEFAULT_PROFILE, ...parsed })
      } catch (error) {
        console.error('Failed refreshing local operator profile:', error)
      }
    },
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

import { createContext, useContext, useMemo, useState } from 'react'

const PortalContext = createContext()

export function PortalProvider({ children }) {
  const [portalMode, setPortalMode] = useState(null)
  const [lastVisited, setLastVisited] = useState({ client: '/client', developer: '/developer' })

  const value = useMemo(
    () => ({ portalMode, setPortalMode, lastVisited, setLastVisited }),
    [portalMode, lastVisited]
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortal() {
  return useContext(PortalContext)
}

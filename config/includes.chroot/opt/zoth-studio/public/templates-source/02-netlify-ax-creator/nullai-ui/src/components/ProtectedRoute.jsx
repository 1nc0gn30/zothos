import { Navigate } from 'react-router-dom'
import { useAuth } from '../app/AuthProvider'

export default function ProtectedRoute({ children }) {
  const { user, hasAccess, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasAccess) {
    return <Navigate to="/playground" replace />
  }

  return children
}

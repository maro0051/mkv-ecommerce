import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../LoadingSpinner'

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-500">You don't have admin privileges.</p>
        </div>
      </div>
    )
  }

  return children
}


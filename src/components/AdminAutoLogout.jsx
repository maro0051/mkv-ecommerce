import useAutoLogout from '../hooks/useAutoLogout'
import { useAuth } from '../context/AuthContext'

export default function AdminAutoLogout() {
  const { user, signOut } = useAuth()

  useAutoLogout({
    isLoggedIn: !!user,
    onLogout: signOut,
    isAdmin: true
  })

  return null // This component doesn't render anything
}


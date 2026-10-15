import useAutoLogout from '../hooks/useAutoLogout'
import { useCustomerAuth } from '../context/CustomerAuthContext'

export default function CustomerAutoLogout() {
  const { customer, signOut } = useCustomerAuth()

  useAutoLogout({
    isLoggedIn: !!customer,
    onLogout: signOut,
    isAdmin: false
  })

  return null // This component doesn't render anything
}


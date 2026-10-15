import { useCustomerAuth } from '../context/CustomerAuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function CheckoutGuard({ children }) {
  const { loading } = useCustomerAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy">
        <LoadingSpinner />
      </div>
    )
  }

  // ✅ Allow both logged-in and guests
  return children
}


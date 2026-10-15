import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiShoppingCart, FiArrowLeft, FiCheck, FiLogIn, FiUserPlus, FiShield, FiTruck, FiClock } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useCustomerAuth } from '../../context/CustomerAuthContext'

export default function CheckoutEntry() {
  const { cartCount, cartTotal } = useCart()
  const { customer, profile } = useCustomerAuth()
  const navigate = useNavigate()

  // If already logged in, go straight to shipping
  if (customer) {
    navigate('/checkout/shipping', { replace: true })
    return null
  }

  const handleContinueAsGuest = () => {
    navigate('/checkout/shipping')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-navy dark:via-navy dark:to-gray-900 py-8 md:py-12">
      <div className="container-custom max-w-4xl">
        
        {/* Back to Cart */}
        <Link to="/cart" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gold mb-6">
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Cart</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FiShoppingCart className="w-10 h-10 text-navy" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy dark:text-white mb-3">
            How would you like to checkout?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            You have <strong className="text-gold">{cartCount} {cartCount === 1 ? 'item' : 'items'}</strong> in your cart 
            totaling <strong className="text-gold">C${cartTotal.toFixed(2)}</strong>
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Option 1: Sign In / Create Account */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-gray-100 dark:border-gray-700 hover:border-gold transition-all">
            <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-5">
              <FiUser className="w-7 h-7 text-gold" />
            </div>

            <h2 className="text-xl font-bold text-navy dark:text-white mb-2">
              Sign In or Create Account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Save time on future orders, track your purchases, and get exclusive member benefits.
            </p>

            {/* Benefits */}
            <div className="space-y-2 mb-6">
              {[
                'Save your shipping details',
                'Track order history',
                'Get exclusive offers',
                'Faster checkout next time',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                to="/customer/login?redirect=/checkout/shipping"
                className="w-full flex items-center justify-center space-x-2 bg-gold text-navy px-6 py-3.5 rounded-xl font-semibold hover:bg-yellow-600 transition-all shadow-lg"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/customer/login?redirect=/checkout/shipping"
                className="w-full flex items-center justify-center space-x-2 border-2 border-gold text-gold px-6 py-3.5 rounded-xl font-semibold hover:bg-gold hover:text-navy transition-all"
              >
                <FiUserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </Link>
            </div>
          </div>

          {/* Option 2: Guest Checkout */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-gray-100 dark:border-gray-700 hover:border-gold transition-all">
            <div className="w-14 h-14 bg-navy/10 dark:bg-gold/20 rounded-xl flex items-center justify-center mb-5">
              <FiShoppingCart className="w-7 h-7 text-navy dark:text-gold" />
            </div>

            <h2 className="text-xl font-bold text-navy dark:text-white mb-2">
              Continue as Guest
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              No account needed. Just enter your shipping info and place your order.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {[
                'No account required',
                'Quick and easy checkout',
                'Choose your payment method',
                'Track via email',
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Guest Button */}
            <button
              onClick={handleContinueAsGuest}
              className="w-full flex items-center justify-center space-x-2 bg-navy dark:bg-gold text-white dark:text-navy px-6 py-3.5 rounded-xl font-semibold hover:bg-gold dark:hover:bg-yellow-600 transition-all shadow-lg"
            >
              <span>🛒</span>
              <span>Continue as Guest</span>
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { icon: <FiShield className="w-5 h-5" />, text: 'Secure Checkout' },
            { icon: <FiTruck className="w-5 h-5" />, text: 'Fast Shipping' },
            { icon: <FiClock className="w-5 h-5" />, text: '24/7 Support' },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <span className="text-gold mb-2">{badge.icon}</span>
              <p className="text-xs font-medium text-navy dark:text-white text-center">{badge.text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}


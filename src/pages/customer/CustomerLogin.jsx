import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowLeft } from 'react-icons/fi'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import toast from 'react-hot-toast'

export default function CustomerLogin() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const { signIn, signUp } = useCustomerAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Get redirect URL from query params, default to my-account
  const redirectTo = searchParams.get('redirect') || '/my-account'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        if (!formData.fullName.trim()) {
          toast.error('Please enter your name')
          setLoading(false)
          return
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        await signUp(formData.email, formData.password, formData.fullName)
        // After signup, redirect to the intended page
        toast.success('Account created! Welcome! 🎉')
        setTimeout(() => navigate(redirectTo), 1000)
      } else {
        await signIn(formData.email, formData.password)
        // After login, redirect to the intended page
        navigate(redirectTo)
      }
    } catch (error) {
      // Error toast already shown in context
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-navy dark:via-navy dark:to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl hover:scale-105 transition-transform">
              <span className="text-3xl font-bold text-navy">M</span>
            </div>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-navy dark:text-white">
            {isSignUp ? 'Join the Family ✨' : 'Welcome Back 🌸'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isSignUp 
              ? 'Create your account and start shopping' 
              : 'Sign in to access your account and checkout'}
          </p>
          {redirectTo !== '/my-account' && (
            <div className="mt-3 inline-flex items-center space-x-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm">
              <span>🔒</span>
              <span>Login required to continue checkout</span>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required={isSignUp}
                    placeholder="Your beautiful name"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="you@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-yellow-500 text-navy py-4 rounded-2xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <span>Please wait...</span>
                </span>
              ) : isSignUp ? (
                '✨ Create Account'
              ) : (
                '🌟 Sign In'
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setFormData({ fullName: '', email: '', password: '' })
                setShowPassword(false)
              }}
              className="text-sm text-gold hover:text-yellow-600 transition-colors font-medium"
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Create one ✨"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-400">or</span>
            </div>
          </div>

          {/* Continue as Guest */}
          {redirectTo.includes('checkout') && (
            <div className="text-center">
              <Link 
                to="/interac-checkout"
                className="text-sm text-gray-500 hover:text-gold transition-colors"
              >
                Continue as Guest →
              </Link>
            </div>
          )}
        </div>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-gold transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center space-x-6 mt-8 text-xs text-gray-400">
          <span>🔒 Secure Login</span>
          <span>🛡️ Protected Data</span>
          <span>✨ Fast Checkout</span>
        </div>
      </div>
    </div>
  )
}


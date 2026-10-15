import { useState, useEffect } from 'react'
import { FiMapPin, FiUser, FiMail, FiPhone, FiHome, FiInfo } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import toast from 'react-hot-toast'

export default function ShippingForm({ profile, onNext }) {
  const { cartTotal, cartCount } = useCart()
  const { customer } = useCustomerAuth()
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    customer_city: '',
    customer_state: '',
    customer_zip: '',
    notes: ''
  })

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        customer_name: profile.full_name || prev.customer_name,
        customer_email: profile.email || prev.customer_email,
        customer_phone: profile.phone || prev.customer_phone,
        customer_address: profile.address || prev.customer_address,
        customer_city: profile.city || prev.customer_city,
        customer_state: profile.state || prev.customer_state,
        customer_zip: profile.zip || prev.customer_zip,
      }))
    }
  }, [profile])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.customer_name.trim()) { toast.error('Please enter your full name'); return }
    if (!formData.customer_email.trim()) { toast.error('Please enter your email'); return }
    if (!formData.customer_address.trim()) { toast.error('Please enter your shipping address'); return }
    if (!formData.customer_city.trim()) { toast.error('Please enter your city'); return }
    onNext(formData)
  }

  const shipping = cartTotal >= 100 ? 0 : 15
  const tax = cartTotal * 0.15
  const total = cartTotal + shipping + tax

  return (
    <div className="space-y-4">
      
      {/* Guest Notice - Only show if NOT logged in */}
      {!customer && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-start space-x-3">
          <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
              Checking out as guest
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              You can complete your order without an account.{' '}
              <Link to="/customer/login?redirect=/checkout/shipping" className="underline font-semibold hover:text-blue-800">
                Sign in
              </Link>{' '}
              to save your details for next time.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
            <FiMapPin className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy dark:text-white">Shipping Information</h2>
            <p className="text-sm text-gray-500">Where should we deliver your order?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                <FiUser className="w-3 h-3 inline mr-1" />Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                <FiMail className="w-3 h-3 inline mr-1" />Email <span className="text-red-500">*</span>
              </label>
              <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} required
                placeholder="john@email.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                <FiPhone className="w-3 h-3 inline mr-1" />Phone Number
              </label>
              <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                <FiHome className="w-3 h-3 inline mr-1" />Address <span className="text-red-500">*</span>
              </label>
              <input type="text" name="customer_address" value={formData.customer_address} onChange={handleChange} required
                placeholder="123 Main Street"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">City <span className="text-red-500">*</span></label>
              <input type="text" name="customer_city" value={formData.customer_city} onChange={handleChange} required
                placeholder="Halifax"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">Province</label>
              <input type="text" name="customer_state" value={formData.customer_state} onChange={handleChange}
                placeholder="Nova Scotia"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy dark:text-white mb-2">Postal Code</label>
              <input type="text" name="customer_zip" value={formData.customer_zip} onChange={handleChange}
                placeholder="B3A 4P2"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy dark:text-white mb-2">Order Notes (optional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2"
              placeholder="Special delivery instructions..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all resize-none" />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal ({cartCount} items)</span>
              <span className="font-semibold text-navy dark:text-white">C${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className={shipping === 0 ? 'text-green-500 font-medium' : 'text-navy dark:text-white font-semibold'}>
                {shipping === 0 ? 'FREE' : `C$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">HST (15%)</span>
              <span className="text-navy dark:text-white font-semibold">C${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t dark:border-gray-600">
              <span className="font-bold text-navy dark:text-white">Total</span>
              <span className="font-bold text-gold">C${total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit"
            className="w-full bg-gold text-navy px-6 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-all shadow-lg">
            Continue to Payment Method →
          </button>
        </form>
      </div>
    </div>
  )
}


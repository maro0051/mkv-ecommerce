import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiCheckCircle, FiCopy, FiMail, FiPhone, FiClock, FiAlertCircle, FiShield } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { placeOrder, getPaymentInstructions } from '../services/checkoutService'
import toast from 'react-hot-toast'

export default function CashCheckout() {
  const { cart, cartTotal, cartCount, clearCart } = useCart()
  const paymentInstructions = getPaymentInstructions()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(null)
  const [savedCart, setSavedCart] = useState(null)
  
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!formData.customer_name || !formData.customer_email || !formData.customer_address) {
      toast.error('Please fill in all required fields (*)')
      return
    }

    setLoading(true)
    try {
      // Save cart before potentially clearing
      setSavedCart([...cart])
      
      const order = await placeOrder({
        ...formData,
        total: cartTotal,
        items: [...cart]
      })

      setOrderPlaced(order)
      setStep(3)
      
      // Clear cart with delay to avoid render conflict
      setTimeout(() => {
        try {
          clearCart()
        } catch (e) {
          console.log('Cart clear error (non-critical):', e)
        }
      }, 200)
      
      toast.success('Order placed! Please complete payment to confirm. 📧')
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text, label = '') => {
    navigator.clipboard.writeText(text)
    toast.success(`${label ? label + ' ' : ''}Copied! 📋`)
  }

  // Get items to display (use savedCart if cart was cleared)
  const displayItems = cart.length > 0 ? cart : (savedCart || [])
  const displayCount = displayItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const displayTotal = displayItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)

  if (cart.length === 0 && !orderPlaced && !savedCart) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy flex items-center justify-center">
        <div className="text-center">
          <FiShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-navy dark:text-white mb-2">Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Add some products before checking out</p>
          <Link to="/shop" className="bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy py-8 md:py-12">
      <div className="container-custom max-w-4xl">
        
        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-10">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Review' },
            { num: 3, label: 'Pay' }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s.num ? 'bg-gold text-navy shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {step > s.num ? <FiCheckCircle className="w-6 h-6" /> : s.num}
                </div>
                <span className={`text-xs mt-2 ${step >= s.num ? 'text-gold font-semibold' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`w-16 md:w-24 h-1 mx-2 mt-[-20px] ${step > s.num ? 'bg-gold' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ===== STEP 1: Shipping Info ===== */}
        {step === 1 && (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
                <span>📦</span>
                <span>Shipping Information</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} required
                    placeholder="john@email.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">Phone Number</label>
                  <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="customer_address" value={formData.customer_address} onChange={handleChange} required
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="customer_city" value={formData.customer_city} onChange={handleChange} required
                    placeholder="New York"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">State</label>
                    <input type="text" name="customer_state" value={formData.customer_state} onChange={handleChange}
                      placeholder="NY"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">ZIP Code</label>
                    <input type="text" name="customer_zip" value={formData.customer_zip} onChange={handleChange}
                      placeholder="10001"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-navy dark:text-white mb-2">Order Notes (optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2"
                  placeholder="Any special instructions for your order..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all resize-none" />
              </div>
            </div>

            <button onClick={() => setStep(2)}
              className="w-full mt-6 bg-gold text-navy px-6 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-all shadow-lg">
              Continue to Review →
            </button>
          </div>
        )}

        {/* ===== STEP 2: Review Order ===== */}
        {step === 2 && (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy dark:text-white mb-6">📋 Review Your Order</h2>
              
              {/* Shipping Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-navy dark:text-white mb-3">📍 Shipping To:</h3>
                <p className="text-gray-600 dark:text-gray-400">{formData.customer_name}</p>
                <p className="text-gray-600 dark:text-gray-400">{formData.customer_address}</p>
                <p className="text-gray-600 dark:text-gray-400">{formData.customer_city}, {formData.customer_state} {formData.customer_zip}</p>
                <p className="text-gray-600 dark:text-gray-400">{formData.customer_email} {formData.customer_phone && `• ${formData.customer_phone}`}</p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-navy dark:text-white">🛍️ Order Items ({displayCount})</h3>
                {displayItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={item.image_url || 'https://placehold.co/48x48'} alt={item.name} 
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/48x48/f3f4f6/94a3b8?text=Item' }} />
                      <div>
                        <p className="font-medium text-navy dark:text-white text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-navy dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-navy dark:text-white">Order Total</span>
                <span className="text-3xl font-bold text-gold">${displayTotal.toFixed(2)}</span>
              </div>

              {/* Payment Method Info */}
              <div className="mt-6 p-4 bg-gold/5 border-2 border-gold/20 rounded-xl">
                <div className="flex items-center space-x-2 text-navy dark:text-white font-semibold mb-2">
                  <span>💳</span>
                  <span>Payment: Interac e-Transfer</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  After placing your order, you'll receive Interac e-Transfer instructions to complete your payment.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button onClick={() => setStep(1)}
                className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-navy dark:text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                ← Edit Shipping
              </button>
              <button onClick={handlePlaceOrder} disabled={loading}
                className="flex-1 bg-gold text-navy px-6 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-all disabled:opacity-50 shadow-lg">
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                    <span>Placing Order...</span>
                  </span>
                ) : 'Place Order & Get Payment Instructions →'}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Payment Instructions ===== */}
        {step === 3 && orderPlaced && (
          <div className="space-y-6">
            
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 md:p-8 text-white text-center shadow-lg">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Placed Successfully! 🎉</h2>
              <p className="text-white/90">Complete your payment to confirm your order</p>
            </div>

            {/* Order Number Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 text-center border-2 border-gold">
              <p className="text-sm text-gray-500 mb-2">YOUR ORDER NUMBER</p>
              <div className="flex items-center justify-center space-x-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gold tracking-wider">
                  {orderPlaced.order_number}
                </h2>
                <button 
                  onClick={() => copyToClipboard(orderPlaced.order_number, 'Order number')}
                  className="p-2 bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors"
                  title="Copy order number"
                >
                  <FiCopy className="w-5 h-5 text-gold" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                ⚠️ Include this number in your Interac e-Transfer message
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="font-bold text-navy dark:text-white mb-4">📋 Order Summary</h3>
              
              {displayItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">{item.name} × {item.quantity}</span>
                  <span className="text-navy dark:text-white font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="border-t dark:border-gray-700 pt-2 flex justify-between">
                <span className="font-bold text-navy dark:text-white">Total to Pay</span>
                <span className="text-xl font-bold text-gold">${displayTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Interac Payment Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-3xl">🏦</span>
                <h3 className="text-xl font-bold text-navy dark:text-white">
                  Interac e-Transfer Payment Instructions
                </h3>
              </div>

              {/* Admin Email - PROMINENT */}
              <div className="bg-gold/10 border-2 border-gold rounded-2xl p-6 mb-6 text-center">
                <p className="text-sm text-gray-500 mb-2">SEND YOUR INTERAC E-TRANSFER TO:</p>
                <div className="flex items-center justify-center space-x-3">
                  <FiMail className="w-8 h-8 text-gold" />
                  <span className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
                    {paymentInstructions.adminEmail}
                  </span>
                </div>
                <button 
                  onClick={() => copyToClipboard(paymentInstructions.adminEmail, 'Email')}
                  className="mt-3 inline-flex items-center space-x-2 bg-gold text-navy px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all text-sm"
                >
                  <FiCopy className="w-4 h-4" />
                  <span>Copy Email Address</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Recipient: <strong>{paymentInstructions.adminName}</strong> • {paymentInstructions.businessName}
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-navy dark:text-white">How to Pay with Interac e-Transfer:</h4>
                {paymentInstructions.instructions.map((instruction) => (
                  <div key={instruction.step} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-gold">{instruction.step}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-navy dark:text-white text-sm">
                        {instruction.icon} {instruction.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {instruction.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Notes */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center space-x-2">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>Important Reminders</span>
                </h4>
                <ul className="space-y-2">
                  {paymentInstructions.importantNotes.map((note, idx) => (
                    <li key={idx} className="text-sm text-red-600 dark:text-red-400 flex items-start space-x-2">
                      <span className="mt-0.5">{note.split(' ')[0]}</span>
                      <span>{note.split(' ').slice(1).join(' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security Note */}
              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                <FiShield className="w-4 h-4 text-green-500" />
                <span>{paymentInstructions.securityNote}</span>
              </div>
            </div>

            {/* Contact Admin */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-bold text-navy dark:text-white mb-3 flex items-center space-x-2">
                <span>❓</span>
                <span>Need Help with Payment?</span>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about the payment process, contact us:
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href={`tel:${paymentInstructions.adminPhone}`} 
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:shadow transition-all">
                  <FiPhone className="w-4 h-4" />
                  <span>{paymentInstructions.adminPhone}</span>
                </a>
                <a href={`mailto:${paymentInstructions.adminEmail}`}
                  className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:shadow transition-all">
                  <FiMail className="w-4 h-4" />
                  <span>{paymentInstructions.adminEmail}</span>
                </a>
                <span className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400">
                  <FiClock className="w-4 h-4" />
                  <span>{paymentInstructions.businessHours}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                We typically respond {paymentInstructions.responseTime}.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Link to="/shop" 
                className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-navy dark:text-white px-6 py-4 rounded-xl font-semibold text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                Continue Shopping
              </Link>
              <Link to="/" 
                className="flex-1 bg-gold text-navy px-6 py-4 rounded-xl font-semibold text-center hover:bg-yellow-600 transition-all shadow-lg">
                Back to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}


import { Link } from 'react-router-dom'
import { FiCheckCircle, FiCopy, FiMail, FiPhone, FiClock, FiAlertCircle, FiShield } from 'react-icons/fi'
import { getPaymentInstructions } from '../../services/checkoutService'
import toast from 'react-hot-toast'

export default function PaymentInstructions({ order, cartTotal }) {
  const paymentInstructions = getPaymentInstructions()
  const shipping = cartTotal >= 100 ? 0 : 15
  const tax = cartTotal * 0.15
  const total = cartTotal + shipping + tax

  const copyToClipboard = (text, label = '') => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  return (
    <div className="space-y-6">
      
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 md:p-8 text-white text-center shadow-lg">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Placed! 🎉</h2>
        <p className="text-white/90">Complete your Interac e-Transfer to confirm your order</p>
      </div>

      {/* Order Number */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border-2 border-gold">
        <p className="text-sm text-gray-500 mb-2">YOUR ORDER NUMBER</p>
        <div className="flex items-center justify-center space-x-3">
          <h2 className="text-3xl font-bold text-gold tracking-wider">{order.order_number}</h2>
          <button onClick={() => copyToClipboard(order.order_number, 'Order number')}
            className="p-2 bg-gold/10 hover:bg-gold/20 rounded-lg">
            <FiCopy className="w-5 h-5 text-gold" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">⚠️ Include this in your e-Transfer message</p>
      </div>

      {/* Amount Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-navy dark:text-white">C${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className={shipping === 0 ? 'text-green-500' : 'text-navy dark:text-white'}>
              {shipping === 0 ? 'FREE' : `C$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">HST (15%)</span>
            <span className="text-navy dark:text-white">C${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t dark:border-gray-700">
            <span className="text-lg font-bold text-navy dark:text-white">Amount to Send</span>
            <span className="text-3xl font-bold text-gold">C${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Interac Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-red-200">
        <h3 className="text-xl font-bold text-navy dark:text-white mb-6">🏦 Interac e-Transfer Instructions</h3>

        {/* Admin Email */}
        <div className="bg-gold/10 border-2 border-gold rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">SEND E-TRANSFER TO:</p>
          <div className="flex items-center justify-center space-x-3">
            <FiMail className="w-8 h-8 text-gold" />
            <span className="text-xl md:text-2xl font-bold text-navy dark:text-white break-all">{paymentInstructions.adminEmail}</span>
          </div>
          <button onClick={() => copyToClipboard(paymentInstructions.adminEmail, 'Email')}
            className="mt-3 bg-gold text-navy px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 text-sm">
            <FiCopy className="w-4 h-4 inline mr-1" /> Copy Email
          </button>
          <p className="text-xs text-gray-500 mt-2">Recipient: {paymentInstructions.adminName}</p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {paymentInstructions.instructions.map((inst) => (
            <div key={inst.step} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gold">{inst.step}</span>
              </div>
              <div>
                <p className="font-semibold text-navy dark:text-white text-sm">{inst.icon} {inst.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{inst.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-4">
          <h4 className="font-semibold text-red-600 mb-2 flex items-center space-x-2">
            <FiAlertCircle className="w-5 h-5" /> <span>Important</span>
          </h4>
          <ul className="space-y-2">
            {paymentInstructions.importantNotes.map((note, idx) => (
              <li key={idx} className="text-sm text-red-600 dark:text-red-400">{note}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
          <FiShield className="w-4 h-4 text-green-500" />
          <span>{paymentInstructions.securityNote}</span>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 text-center">
        <h3 className="font-bold text-navy dark:text-white mb-3">❓ Need Help?</h3>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href={`tel:${paymentInstructions.adminPhone}`} className="flex items-center space-x-2 text-blue-600">
            <FiPhone className="w-4 h-4" /> {paymentInstructions.adminPhone}
          </a>
          <a href={`mailto:${paymentInstructions.adminEmail}`} className="flex items-center space-x-2 text-blue-600">
            <FiMail className="w-4 h-4" /> {paymentInstructions.adminEmail}
          </a>
          <span className="flex items-center space-x-2 text-gray-500">
            <FiClock className="w-4 h-4" /> {paymentInstructions.businessHours}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-3">
        <Link to="/shop" className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-navy dark:text-white px-6 py-4 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all">
          Continue Shopping
        </Link>
        <Link to="/my-account" className="flex-1 bg-gold text-navy px-6 py-4 rounded-xl font-semibold text-center hover:bg-yellow-600 transition-all shadow-lg">
          View My Orders
        </Link>
      </div>
    </div>
  )
}


import { Link } from 'react-router-dom'
import { FiCheckCircle, FiCopy, FiMail, FiAlertCircle, FiShield, FiExternalLink } from 'react-icons/fi'
import { SiPaypal } from 'react-icons/si'
import toast from 'react-hot-toast'

const PAYPAL_EMAIL = 'manassekilembi@gmail.com'

export default function PayPalSuccess({ order, cartTotal }) {
  const shipping = cartTotal >= 100 ? 0 : 15
  const tax = cartTotal * 0.15
  const total = cartTotal + shipping + tax

  const copyToClipboard = (text, label = '') => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  const paypalLink = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${PAYPAL_EMAIL}&item_name=M.K.V+Order+${order.order_number}&amount=${total.toFixed(2)}&currency_code=CAD`

  return (
    <div className="space-y-6">
      
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 md:p-8 text-white text-center shadow-lg">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <SiPaypal className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Placed! 🎉</h2>
        <p className="text-white/90">Complete your PayPal payment to confirm your order</p>
      </div>

      {/* Order Number */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border-2 border-blue-500">
        <p className="text-sm text-gray-500 mb-2">YOUR ORDER NUMBER</p>
        <div className="flex items-center justify-center space-x-3">
          <h2 className="text-3xl font-bold text-blue-600 tracking-wider">{order.order_number}</h2>
          <button onClick={() => copyToClipboard(order.order_number, 'Order number')}
            className="p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg">
            <FiCopy className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">⚠️ Include this as reference in PayPal payment</p>
      </div>

      {/* Amount */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
        <p className="text-4xl font-bold text-gold mb-2">C${total.toFixed(2)}</p>
        <p className="text-xs text-gray-500">CAD (Canadian Dollars)</p>
      </div>

      {/* PayPal Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
          <SiPaypal className="w-6 h-6 text-blue-600" />
          <span>PayPal Payment Instructions</span>
        </h3>

        {/* PayPal Email */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">SEND PAYPAL PAYMENT TO:</p>
          <div className="flex items-center justify-center space-x-3">
            <SiPaypal className="w-8 h-8 text-blue-600" />
            <span className="text-xl md:text-2xl font-bold text-navy dark:text-white break-all">{PAYPAL_EMAIL}</span>
          </div>
          <button onClick={() => copyToClipboard(PAYPAL_EMAIL, 'Email')}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm">
            <FiCopy className="w-4 h-4 inline mr-1" /> Copy Email
          </button>
        </div>

        {/* PayPal Pay Button */}
        <a
          href={paypalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white text-center px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg mb-6"
        >
          <FiExternalLink className="w-5 h-5 inline mr-2" />
          Pay C${total.toFixed(2)} with PayPal Now
        </a>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {[
            { step: 1, title: 'Click the PayPal button above', desc: 'Or open PayPal and send payment manually' },
            { step: 2, title: 'Enter the amount', desc: `Send exactly C$${total.toFixed(2)} CAD` },
            { step: 3, title: 'Add your order number as note', desc: `Reference: ${order.order_number}` },
            { step: 4, title: 'Complete the payment', desc: 'Your order will be processed once confirmed' },
          ].map(inst => (
            <div key={inst.step} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-blue-600">{inst.step}</span>
              </div>
              <div>
                <p className="font-semibold text-navy dark:text-white text-sm">{inst.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{inst.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <h4 className="font-semibold text-red-600 mb-2 flex items-center space-x-2">
            <FiAlertCircle className="w-5 h-5" /> <span>Important</span>
          </h4>
          <ul className="space-y-1.5 text-sm text-red-600 dark:text-red-400">
            <li>⚠️ Always include your order number in the PayPal note</li>
            <li>⚠️ Send the exact amount in CAD currency</li>
            <li>⚠️ Orders are processed once payment is confirmed</li>
            <li>⚠️ Keep your PayPal receipt for your records</li>
          </ul>
        </div>

        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
          <FiShield className="w-4 h-4 text-green-500" />
          <span>PayPal Buyer Protection included with your payment</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-3">
        <Link to="/shop" className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-navy dark:text-white px-6 py-4 rounded-xl font-semibold text-center hover:bg-gray-50 transition-all">
          Continue Shopping
        </Link>
        <Link to="/my-account" className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-all shadow-lg">
          View My Orders
        </Link>
      </div>
    </div>
  )
}


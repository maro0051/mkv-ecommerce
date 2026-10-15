import { useState } from 'react'
import { FiMapPin, FiEdit2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { placeOrder } from '../../services/checkoutService'
import { sendOrderPlacedEmail, sendAdminNewOrderAlert } from '../../services/emailService'
import toast from 'react-hot-toast'

export default function InteracPayment({ shippingData, cart, cartTotal, onBack, onComplete }) {
  const [loading, setLoading] = useState(false)
  const { clearCart } = useCart()

  const shipping = cartTotal >= 100 ? 0 : 15
  const tax = cartTotal * 0.15
  const total = cartTotal + shipping + tax

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const order = await placeOrder({
        ...shippingData,
        total: total,
        items: [...cart],
        payment_method: 'interac'
      })

      // 📧 Send customer confirmation email
      sendOrderPlacedEmail(
        shippingData.customer_email,
        shippingData.customer_name,
        order
      ).catch(err => console.log('Customer email failed:', err))

      // 📧 Send admin notification email
      sendAdminNewOrderAlert(order)
        .catch(err => console.log('Admin email failed:', err))

      setTimeout(() => { try { clearCart() } catch (e) {} }, 200)
      onComplete(order)
      toast.success('Order placed! Check your email for confirmation. 📧')
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-navy dark:bg-gold rounded-xl flex items-center justify-center text-xl">
              🏦
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy dark:text-white">Review Order</h2>
              <p className="text-xs text-gray-500">Payment: Interac e-Transfer</p>
            </div>
          </div>
          <button onClick={onBack} className="text-gold hover:text-yellow-600 text-sm flex items-center space-x-1">
            <FiEdit2 className="w-3 h-3" />
            <span>Change</span>
          </button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <FiMapPin className="w-4 h-4 text-gold" />
            <p className="text-xs font-semibold text-gray-500 uppercase">Shipping To</p>
          </div>
          <p className="font-semibold text-navy dark:text-white">{shippingData.customer_name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{shippingData.customer_address}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {shippingData.customer_city}, {shippingData.customer_state} {shippingData.customer_zip}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{shippingData.customer_email}</p>
          {shippingData.customer_phone && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{shippingData.customer_phone}</p>
          )}
        </div>

        <h2 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
          <FiShoppingBag className="w-5 h-5 text-gold" />
          <span>Order Items ({cart.length})</span>
        </h2>
        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={item.uniqueId || item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.selectedVariant?.image_url || item.image_url || 'https://placehold.co/48x48'} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/48x48' }} 
                />
                <div>
                  <p className="font-medium text-navy dark:text-white text-sm">{item.name}</p>
                  {item.selectedVariant && (
                    <p className="text-xs text-gold">{item.selectedVariant.name}: {item.selectedVariant.value}</p>
                  )}
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × C${Number(item.price).toFixed(2)}</p>
                </div>
              </div>
              <span className="font-semibold text-navy dark:text-white">
                C${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t dark:border-gray-700 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-navy dark:text-white">C${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            {shipping === 0 ? (
              <span className="text-green-500 font-medium">FREE</span>
            ) : (
              <span className="text-navy dark:text-white">C${shipping.toFixed(2)}</span>
            )}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">HST (15%)</span>
            <span className="text-navy dark:text-white">C${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t dark:border-gray-700">
            <span className="text-lg font-bold text-navy dark:text-white">Total</span>
            <span className="text-2xl font-bold text-gold">C${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gold/5 border-2 border-gold/20 rounded-xl">
          <p className="text-sm text-navy dark:text-white font-medium mb-1">💳 Payment Method: Interac e-Transfer</p>
          <p className="text-xs text-gray-500">
            After placing your order, you'll receive payment instructions to send Interac e-Transfer to:
            <strong className="text-gold"> Mkvisionbusiness@gmail.com</strong>
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button 
          onClick={onBack}
          className="flex-1 border-2 border-gray-200 dark:border-gray-600 text-navy dark:text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center space-x-2"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button 
          onClick={handlePlaceOrder} 
          disabled={loading}
          className="flex-1 bg-gold text-navy px-6 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <span>🏦</span>
              <span>Place Order & Pay via Interac</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}


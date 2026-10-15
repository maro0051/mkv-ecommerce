import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiMapPin, FiCheckCircle, FiCreditCard, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import ShippingForm from './ShippingForm'
import PaymentMethodSelect from './PaymentMethodSelect'
import InteracPayment from './InteracPayment'
import PayPalPayment from './PayPalPayment'
import PaymentInstructions from './PaymentInstructions'
import PayPalSuccess from './PayPalSuccess'

export default function CheckoutLayout() {
  const [step, setStep] = useState(1)
  const [shippingData, setShippingData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [orderPlaced, setOrderPlaced] = useState(null)
  const { cart, cartTotal, cartCount } = useCart()
  const { customer, profile } = useCustomerAuth()

  if (cart.length === 0 && !orderPlaced) {
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

  const steps = [
    { num: 1, icon: <FiMapPin className="w-5 h-5" />, label: 'Shipping' },
    { num: 2, icon: <FiCreditCard className="w-5 h-5" />, label: 'Payment' },
    { num: 3, icon: <FiCheckCircle className="w-5 h-5" />, label: 'Confirm' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy py-8 md:py-12">
      <div className="container-custom max-w-4xl">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/cart" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gold mb-2">
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Cart</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">Checkout</h1>
          </div>
          
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <FiUser className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy dark:text-white">
                {profile?.full_name || customer?.email}
              </p>
              <p className="text-xs text-gray-500">{cartCount} items</p>
            </div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step > s.num ? 'bg-green-500 text-white' :
                    step === s.num ? 'bg-gold text-navy shadow-lg' : 
                    'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {step > s.num ? <FiCheckCircle className="w-6 h-6" /> : s.icon}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-gold' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 md:w-32 h-1 mx-2 mt-[-20px] rounded-full ${
                    step > s.num ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Shipping Form */}
        {step === 1 && (
          <ShippingForm 
            profile={profile}
            onNext={(data) => { 
              setShippingData(data)
              setStep(2) 
            }}
          />
        )}

        {/* STEP 2: Payment Method Selection */}
        {step === 2 && (
          <PaymentMethodSelect 
            onBack={() => setStep(1)}
            onNext={(method) => { 
              setPaymentMethod(method)
              setStep(3) 
            }}
            shippingData={shippingData}
          />
        )}

        {/* STEP 3: Review - based on payment method */}
        {step === 3 && paymentMethod === 'interac' && (
          <InteracPayment
            shippingData={shippingData}
            cart={cart}
            cartTotal={cartTotal}
            onBack={() => setStep(2)}
            onComplete={(order) => { 
              setOrderPlaced(order)
              setStep(4)
            }}
          />
        )}

        {step === 3 && paymentMethod === 'paypal' && (
          <PayPalPayment
            shippingData={shippingData}
            cart={cart}
            cartTotal={cartTotal}
            onBack={() => setStep(2)}
            onComplete={(order) => { 
              setOrderPlaced(order)
              setStep(4)
            }}
          />
        )}

        {/* STEP 4: Payment Instructions */}
        {step === 4 && orderPlaced && paymentMethod === 'interac' && (
          <PaymentInstructions 
            order={orderPlaced}
            cart={cart}
            cartTotal={cartTotal}
            shippingData={shippingData}
          />
        )}

        {step === 4 && orderPlaced && paymentMethod === 'paypal' && (
          <PayPalSuccess 
            order={orderPlaced}
            cart={cart}
            cartTotal={cartTotal}
          />
        )}

      </div>
    </div>
  )
}


import { FiCreditCard, FiCheck, FiArrowLeft, FiShield } from 'react-icons/fi'
import { SiPaypal } from 'react-icons/si'
import { useState } from 'react'

export default function PaymentMethodSelect({ onBack, onNext, shippingData }) {
  const [selected, setSelected] = useState('interac')

  const methods = [
    {
      id: 'interac',
      name: 'Interac e-Transfer',
      icon: '🏦',
      description: 'Pay via your bank using Interac e-Transfer',
      details: 'Fast, secure, and available at all Canadian banks',
      badge: 'Most Popular'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <SiPaypal className="w-8 h-8 text-blue-600" />,
      description: 'Pay with your PayPal account or credit card',
      details: 'Buyer protection included',
      badge: 'Secure'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <FiCreditCard className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white">Payment Method</h2>
              <p className="text-sm text-gray-500">How would you like to pay?</p>
            </div>
          </div>
          <button onClick={onBack} className="text-gold hover:text-yellow-600 text-sm flex items-center space-x-1">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Shipping Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Shipping to:</p>
          <p className="text-sm text-navy dark:text-white font-medium">{shippingData?.customer_name}</p>
          <p className="text-xs text-gray-500">{shippingData?.customer_address}, {shippingData?.customer_city}</p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {methods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                selected === method.id
                  ? 'border-gold bg-gold/5 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gold/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  method.id === 'interac' ? 'bg-navy text-2xl' : 'bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  {method.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-navy dark:text-white">{method.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                      {method.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{method.details}</p>
                </div>

                {selected === method.id && (
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="w-4 h-4 text-navy" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Security Note */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <FiShield className="w-4 h-4 text-green-500" />
          <span>All payments are secure and encrypted</span>
        </div>

        <button
          onClick={() => onNext(selected)}
          className="w-full bg-gold text-navy px-6 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-all shadow-lg"
        >
          Continue with {selected === 'interac' ? 'Interac' : 'PayPal'} →
        </button>
      </div>
    </div>
  )
}


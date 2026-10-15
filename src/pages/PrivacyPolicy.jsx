import { Link } from 'react-router-dom'
import { FiArrowLeft, FiLock, FiEye, FiTrash2, FiShield } from 'react-icons/fi'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy py-12">
      <div className="container-custom max-w-4xl">
        
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gold mb-8">
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-navy dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              At M.K.H, we take your privacy seriously. This policy describes how we collect, use, and protect 
              your personal information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiEye className="w-5 h-5 text-gold" />
              <span>Information We Collect</span>
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><strong>Personal Information:</strong> Name, email address, phone number, and shipping address when you place an order.</p>
              <p><strong>Order Information:</strong> Products purchased, order history, and payment references.</p>
              <p><strong>Account Information:</strong> If you create an account, we store your login credentials securely.</p>
              <p><strong>Usage Data:</strong> Pages visited, time spent on site (for analytics improvement).</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiLock className="w-5 h-5 text-gold" />
              <span>How We Protect Your Data</span>
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>• All data is stored securely on encrypted servers (Supabase)</p>
              <p>• Passwords are hashed and never stored in plain text</p>
              <p>• Payment information is never stored on our servers</p>
              <p>• We use secure HTTPS connections for all data transfers</p>
              <p>• Regular security updates and monitoring</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiShield className="w-5 h-5 text-gold" />
              <span>How We Use Your Information</span>
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>• To process and fulfill your orders</p>
              <p>• To communicate about your order status</p>
              <p>• To improve our products and services</p>
              <p>• To send promotional offers (with your consent)</p>
              <p>• To comply with legal obligations</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Information Sharing</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We do NOT sell, trade, or share your personal information with third parties for marketing purposes. 
              We only share information as necessary to process your order (e.g., shipping carriers).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Cookies</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We use essential cookies for site functionality (cart, login sessions). We do not use tracking 
              cookies for advertising purposes. You can disable cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiTrash2 className="w-5 h-5 text-gold" />
              <span>Your Rights</span>
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>• <strong>Access:</strong> Request a copy of your personal data</p>
              <p>• <strong>Correction:</strong> Update inaccurate information</p>
              <p>• <strong>Deletion:</strong> Request deletion of your data</p>
              <p>• <strong>Opt-out:</strong> Unsubscribe from marketing emails</p>
              <p>• <strong>Portability:</strong> Receive your data in a portable format</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              For privacy-related inquiries, contact us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mt-3 space-y-2">
              <p className="text-navy dark:text-white font-medium">M.K.H Privacy Team</p>
              <p className="text-gray-600 dark:text-gray-400">📧 info@mkhholdings.com</p>
              <p className="text-gray-600 dark:text-gray-400">📞 +1 (418) 490-1884</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}


import { Link } from 'react-router-dom'
import { FiArrowLeft, FiShield, FiTruck, FiRefreshCw, FiCreditCard, FiAlertCircle } from 'react-icons/fi'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy py-12">
      <div className="container-custom max-w-4xl">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gold mb-8">
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-navy dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">1. Introduction</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Welcome to M.K.H ("Company", "we", "our", "us"). These Terms and Conditions govern your use of our website 
              and the purchase of products from our store. By accessing or using our website, you agree to be bound by 
              these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          {/* 2. Products & Services */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">2. Products & Services</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              M.K.V specializes in the selection and marketing of quality products including:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li>Watches</li>
              <li>Sportswear</li>
              <li>Bags</li>
              <li>Perfumes</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              We work with reliable suppliers to offer items that meet expectations in terms of quality, style, and price.
              All products are subject to availability. We reserve the right to discontinue any product at any time.
            </p>
          </section>

          {/* 3. Orders & Payment */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiCreditCard className="w-5 h-5 text-gold" />
              <span>3. Orders & Payment</span>
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>3.1 Order Placement:</strong> By placing an order, you agree to purchase the products at the prices indicated. All orders are subject to acceptance and availability.</p>
              <p><strong>3.2 Payment Methods:</strong> We accept Interac e-Transfer as our primary payment method. Payment instructions are provided after order placement.</p>
              <p><strong>3.3 Order Confirmation:</strong> Your order is confirmed once payment is received and verified. You will receive your order number for reference.</p>
              <p><strong>3.4 Pricing:</strong> All prices are in USD and are subject to change without notice. The price at the time of order placement is the final price.</p>
              <p><strong>3.5 Order Cancellation:</strong> You may cancel your order within 24 hours of placement, provided payment has not been processed.</p>
            </div>
          </section>

          {/* 4. Shipping & Delivery */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiTruck className="w-5 h-5 text-gold" />
              <span>4. Shipping & Delivery</span>
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>4.1 Shipping:</strong> We offer free shipping on orders over $100. Standard shipping rates apply for orders below this amount.</p>
              <p><strong>4.2 Delivery Time:</strong> Orders are typically processed within 2-3 business days after payment confirmation. Delivery times vary by location (5-10 business days).</p>
              <p><strong>4.3 Shipping Address:</strong> Please ensure your shipping address is correct. We are not responsible for orders shipped to incorrect addresses provided by the customer.</p>
              <p><strong>4.4 International Shipping:</strong> International orders may be subject to customs duties and taxes. These charges are the responsibility of the customer.</p>
            </div>
          </section>

          {/* 5. Refund & Return Policy */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiRefreshCw className="w-5 h-5 text-gold" />
              <span>5. Refund & Return Policy</span>
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-4">
                <p className="font-semibold text-navy dark:text-white mb-2">Our Guarantee:</p>
                <p>We want you to be completely satisfied with your purchase. If you're not happy, we offer a 30-day return policy.</p>
              </div>
              <p><strong>5.1 Return Window:</strong> You have 30 calendar days from the date of delivery to return an item.</p>
              <p><strong>5.2 Eligibility:</strong> To be eligible for a return, items must be:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Unused and in original condition</li>
                  <li>In original packaging with all tags attached</li>
                  <li>Accompanied by proof of purchase (order number)</li>
                </ul>
              </p>
              <p><strong>5.3 Non-Returnable Items:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Opened perfumes and fragrances</li>
                  <li>Worn or used clothing items</li>
                  <li>Items without original packaging</li>
                  <li>Sale or clearance items (final sale)</li>
                </ul>
              </p>
              <p><strong>5.4 Refund Process:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Refunds are processed within 5-10 business days after we receive the returned item</li>
                  <li>Refunds will be issued via Interac e-Transfer to the email used for purchase</li>
                  <li>Original shipping charges are non-refundable</li>
                  <li>Return shipping costs are the responsibility of the customer</li>
                </ul>
              </p>
              <p><strong>5.5 Damaged or Defective Items:</strong> If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos. We will arrange a replacement or full refund including shipping.</p>
            </div>
          </section>

          {/* 6. Privacy & Security */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiShield className="w-5 h-5 text-gold" />
              <span>6. Privacy & Security</span>
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>6.1 Personal Information:</strong> We collect only necessary information to process your order. Your data is never sold or shared with third parties.</p>
              <p><strong>6.2 Payment Security:</strong> We use Interac e-Transfer which is protected by your bank's security measures. We never store your banking information.</p>
              <p><strong>6.3 Communication:</strong> By placing an order, you agree to receive transactional emails related to your order. You may opt out of marketing communications at any time.</p>
            </div>
          </section>

          {/* 7. Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              All content on this website including logos, images, text, and design is the property of M.K.V and is 
              protected by copyright laws. You may not reproduce, distribute, or use any content without our written permission.
            </p>
          </section>

          {/* 8. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              M.K.V shall not be liable for any indirect, incidental, or consequential damages arising from the use 
              of our products or website. Our liability is limited to the purchase price of the product in question.
            </p>
          </section>

          {/* 9. Contact Information */}
          <section>
            <h2 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center space-x-2">
              <FiAlertCircle className="w-5 h-5 text-gold" />
              <span>9. Contact Us</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
              <p className="text-navy dark:text-white font-medium">M.K.H Store</p>
              <p className="text-gray-600 dark:text-gray-400">📧 info@mkhholdings.com</p>
              <p className="text-gray-600 dark:text-gray-400">📞 +1 (418) 490-1884</p>
              <p className="text-gray-600 dark:text-gray-400">📍 Ottawa, Canada</p>
              <p className="text-gray-600 dark:text-gray-400">📍 Kinshasa, Congo DR</p>
              <p className="text-gray-600 dark:text-gray-400">🕐 Monday - Saturday: 9AM - 8PM</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}


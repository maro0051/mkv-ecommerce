import { Link } from 'react-router-dom'
import { FiCheckCircle, FiHeart, FiShield, FiTruck, FiUsers, FiTarget, FiAward, FiSmile, FiArrowRight } from 'react-icons/fi'
import BackButton from '../components/BackButton'

export default function About() {
  const values = [
    {
      icon: <FiCheckCircle className="w-7 h-7" />,
      title: 'Quality First',
      description: 'Every product is carefully selected to meet our high standards of quality and craftsmanship.',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-500',
    },
    {
      icon: <FiHeart className="w-7 h-7" />,
      title: 'Customer Satisfaction',
      description: 'Your happiness is our priority. We strive to provide an exceptional shopping experience.',
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      iconColor: 'text-red-500',
    },
    {
      icon: <FiShield className="w-7 h-7" />,
      title: 'Trusted Suppliers',
      description: 'We partner exclusively with reliable, verified suppliers to bring you the best products.',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      iconColor: 'text-green-500',
    },
    {
      icon: <FiTruck className="w-7 h-7" />,
      title: 'Fast Delivery',
      description: 'Quick and secure shipping to ensure your products arrive safely and on time.',
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-500',
    },
  ]

  const stats = [
    { number: '10K+', label: 'Happy Customers', icon: <FiSmile className="w-6 h-6" /> },
    { number: '500+', label: 'Premium Products', icon: <FiAward className="w-6 h-6" /> },
    { number: '50+', label: 'Trusted Suppliers', icon: <FiUsers className="w-6 h-6" /> },
    { number: '24/7', label: 'Customer Support', icon: <FiTarget className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* ===== HERO BANNER ===== */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
          alt="About M.K.V"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <div className="max-w-2xl">
              <span className="inline-block bg-gold/20 backdrop-blur-sm text-gold text-xs font-semibold px-4 py-2 rounded-full mb-4 tracking-wider uppercase border border-gold/30">
                Our Story
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                About <span className="text-gold">M.K.H</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                Elegance at your fingertips — Curating quality products for every style since day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPANY OVERVIEW ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-3 mb-6 text-navy dark:text-white">
                Our Story & Mission
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  M.K.H is a company specializing in the selection and marketing of quality products. 
                  We work with reliable suppliers to offer our customers items that meet their 
                  expectations in terms of <span className="text-gold font-semibold">quality</span>, 
                  <span className="text-gold font-semibold"> style</span>, and 
                  <span className="text-gold font-semibold"> price</span>.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Our journey began with a simple mission: to provide a curated selection of premium 
                  products that enhance your lifestyle. We believe that elegance should be accessible, 
                  and style should be effortless.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Today, we serve thousands of satisfied customers worldwide, offering a carefully 
                  selected range of watches, sportswear, bags, and perfumes that combine quality 
                  craftsmanship with contemporary design.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-serif font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
                  <span className="text-2xl">🎯</span>
                  <span>Our Vision & Objectives</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Our goal is to offer a simple and satisfying shopping experience by providing our 
                  customers with a range of carefully selected products.
                </p>
                <ul className="space-y-3">
                  {[
                    'Curate premium quality products',
                    'Ensure customer satisfaction',
                    'Maintain competitive pricing',
                    'Build lasting relationships',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                      <FiCheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container-custom relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-gold mb-3 flex justify-center">{stat.icon}</div>
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US / VALUES ===== */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mt-3 mb-4 text-navy dark:text-white">
              The M.K.H Difference
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className={`group p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${value.color}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 shadow-md group-hover:scale-110 transition-transform ${value.iconColor}`}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SLOGAN CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-navy to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 75% 50%, #D4AF37 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="container-custom relative text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-4xl md:text-6xl mb-6 block">✨</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              "Elegance at your <span className="text-gold">fingertips</span>"
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Watches, sportswear, bags, and perfumes for every style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center space-x-2 bg-gold text-navy px-8 py-4 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <span>Explore Collection</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center space-x-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BACK BUTTON ===== */}
      <div className="container-custom py-8">
        <div className="flex justify-center">
          <BackButton to="/" text="🏠 Back to Home" variant="cute" />
        </div>
      </div>
    </div>
  )
}


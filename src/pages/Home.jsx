import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiTruck, FiShield, FiHeadphones, FiRefreshCw } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchFeaturedProducts, fetchCategories } from '../services/supabase'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [products, cats] = await Promise.all([
        fetchFeaturedProducts(),
        fetchCategories()
      ])
      setFeaturedProducts(products || [])
      setCategories(cats || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center bg-navy overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy/90" />

        <div className="container-custom relative py-20 md:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-gold text-sm font-medium">Premium Collection 2025</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Elegance at Your{' '}
              <span className="text-gold relative">
                Fingertips
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 4" preserveAspectRatio="none">
                  <path d="M0 2 Q50 4 100 2" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.5"/>
                </svg>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
              Watches • Sportswear • Bags • Perfumes etc.
            </p>
            <p className="text-base md:text-lg text-gray-400 mb-10 leading-relaxed max-w-xl">
              Discover our curated collection of premium products designed to elevate 
              your lifestyle with unmatched quality and sophisticated style.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link 
                to="/shop" 
                className="bg-gold text-navy px-8 py-4 rounded-lg font-semibold text-center hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Explore Collection
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-center hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                Our Story
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <FiTruck className="w-5 h-5" />, label: 'Free Shipping', sub: 'Over $100' },
                { icon: <FiShield className="w-5 h-5" />, label: 'Secure Payment', sub: '100% Protected' },
                { icon: <FiHeadphones className="w-5 h-5" />, label: '24/7 Support', sub: 'Always Here' },
                { icon: <FiRefreshCw className="w-5 h-5" />, label: 'Easy Returns', sub: '30 Days Policy' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-gold flex-shrink-0">{feature.icon}</span>
                  <div>
                    <p className="text-white text-xs md:text-sm font-medium leading-tight">{feature.label}</p>
                    <p className="text-gray-400 text-[10px] md:text-xs">{feature.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTRODUCTION ===== */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">
              Welcome to M.K.H
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mt-4 mb-6 text-navy dark:text-white leading-tight">
              Curating Quality,{' '}
              <span className="text-gold">Delivering Excellence</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              We specialize in selecting and marketing quality products that meet your expectations 
              in quality, style, and price. Our team partners with trusted suppliers worldwide to 
              bring you items that enhance your everyday life.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center space-x-2 text-gold font-semibold hover:text-yellow-600 transition-colors group"
            >
              <span>Learn More About Us</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-navy">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">
              Handpicked for You
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mt-4 mb-6 text-navy dark:text-white">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our most sought-after items, selected for their exceptional quality and design.
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Featured products coming soon!
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/shop" 
              className="inline-flex items-center space-x-2 bg-navy dark:bg-gold text-white dark:text-navy px-8 py-4 rounded-lg font-semibold hover:bg-gold dark:hover:bg-yellow-600 transition-all duration-300 group"
            >
              <span>View All Products</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">
              Browse Collections
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mt-4 mb-6 text-navy dark:text-white">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find exactly what you need in our carefully organized categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-navy">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mt-4 mb-6 text-navy dark:text-white">
              Loved by Our Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Verified Buyer',
                text: 'The quality exceeded my expectations. Shopping was seamless and delivery was incredibly fast!',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Regular Customer',
                text: 'I appreciate the curated collection. Each item feels special and the prices reflect true value.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'First-time Buyer',
                text: 'Outstanding service! They helped me find the perfect gift. Will definitely return.',
                rating: 5
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex text-gold mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-gold font-bold text-lg">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-navy to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 75% 50%, #D4AF37 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container-custom relative text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust M.K. for their lifestyle needs.
            Experience the difference today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop" 
              className="bg-gold text-navy px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


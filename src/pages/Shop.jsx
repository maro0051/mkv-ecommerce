import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiGrid, FiList, FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchProducts, fetchCategories } from '../services/supabase'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const productsPerPage = 12

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])
      setProducts(productsData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name-asc':
          return a.name?.localeCompare(b.name)
        case 'name-desc':
          return b.name?.localeCompare(a.name)
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSortBy('newest')
    setSearchParams({})
  }

  const hasActiveFilters = searchTerm || selectedCategory || sortBy !== 'newest'

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy">
      <div className="container-custom py-8 md:py-12">
        
        {/* ===== PAGE HEADER ===== */}
        <div className="text-center mb-8">
          <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">
            Our Collection
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-3 text-navy dark:text-white">
            Shop All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Browse our complete collection of premium products. 
            Use the filters below to find exactly what you're looking for.
          </p>
        </div>

        {/* ===== FILTERS SECTION ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 mb-8">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-navy dark:text-white font-medium"
          >
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5" />
              <span>Filters & Sorting</span>
            </div>
            <FiChevronDown className={`w-5 h-5 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Controls */}
          <div className={`space-y-4 md:space-y-0 ${mobileFiltersOpen ? 'block mt-4' : 'hidden'} md:block`}>
            
            {/* Search Bar - Full Width on Mobile */}
            <div className="relative mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filter & Sort Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Category Filter */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm font-medium"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pt-6 pointer-events-none">
                  <FiChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Sort By */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pt-6 pointer-events-none">
                  <FiChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    hasActiveFilters
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <FiX className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Active Filters Indicators */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedCategory && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gold/10 text-gold rounded-full text-xs font-medium">
                    <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('')} className="hover:text-red-500">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gold/10 text-gold rounded-full text-xs font-medium">
                    <span>Search: "{searchTerm}"</span>
                    <button onClick={() => setSearchTerm('')} className="hover:text-red-500">
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== RESULTS COUNT ===== */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-navy dark:text-white">{paginatedProducts.length}</span> of{' '}
            <span className="font-semibold text-navy dark:text-white">{filteredProducts.length}</span> products
            {selectedCategory && <span> in <span className="text-gold font-semibold">{selectedCategory}</span></span>}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FiGrid className="w-4 h-4" />
            <span>Grid View</span>
          </div>
        </div>

        {/* ===== PRODUCTS GRID ===== */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-navy dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-gold hover:text-gold'
                  }`}
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first, last, current, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                            currentPage === page
                              ? 'bg-gold text-navy shadow-lg'
                              : 'bg-white dark:bg-gray-800 text-navy dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-gold'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                {/* Mobile Page Indicator */}
                <span className="sm:hidden px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium text-navy dark:text-white border-2 border-gray-200 dark:border-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-navy dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-gold hover:text-gold'
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria. 
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gold text-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiX, FiTrendingUp, FiClock } from 'react-icons/fi'
import { quickSearch } from '../services/searchService'

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    const saved = localStorage.getItem('mkv-recent-searches')
    if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5))
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([])
      return
    }

    const searchProducts = async () => {
      setLoading(true)
      try {
        const data = await quickSearch(searchTerm)
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  const handleSelect = (product) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    localStorage.setItem('mkv-recent-searches', JSON.stringify(updated))
    onClose()
    navigate(`/product/${product.id}`)
  }

  const handleSearchAll = () => {
    if (searchTerm.trim()) {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
      localStorage.setItem('mkv-recent-searches', JSON.stringify(updated))
      onClose()
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const clearRecent = () => {
    localStorage.removeItem('mkv-recent-searches')
    setRecentSearches([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-down">
        <div className="flex items-center p-4 border-b dark:border-gray-700">
          <FiSearch className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchAll()}
            placeholder="Search for watches, perfumes, bags..."
            className="flex-1 ml-3 bg-transparent text-navy dark:text-white outline-none text-lg placeholder-gray-400"
          />
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ml-2">
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-2">
              {results.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
                >
                  <img 
                    src={product.image_url || 'https://placehold.co/48x48'} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/48x48/f3f4f6/94a3b8?text=N/A' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy dark:text-white group-hover:text-gold transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className="font-bold text-gold text-sm">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </button>
              ))}
              
              <button
                onClick={handleSearchAll}
                className="w-full text-center py-3 text-gold font-semibold hover:bg-gold/5 rounded-lg transition-colors"
              >
                See all results for "{searchTerm}" →
              </button>
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="text-center py-12">
              <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products found for "{searchTerm}"</p>
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center space-x-2">
                  <FiClock className="w-4 h-4" />
                  <span>Recent Searches</span>
                </h3>
                <button onClick={clearRecent} className="text-xs text-gray-400 hover:text-red-500">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400 hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center space-x-2">
                <FiTrendingUp className="w-4 h-4" />
                <span>Popular Searches</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Perfumes', 'Watches', 'Sportswear', 'Bags', 'Luxury', 'Gift'].map(term => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400 hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


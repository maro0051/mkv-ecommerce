import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiPackage } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const stock = product.stock || 0
  const isAvailable = product.is_available !== false && stock > 0
  const isLowStock = stock > 0 && stock <= 5

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAvailable) {
      toast.error('This product is currently unavailable')
      return
    }
    
    addToCart(product)
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success('Added to wishlist', { icon: '❤️' })
  }

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ${
      !isAvailable ? 'opacity-75' : ''
    }`}>
      
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={product.image_url || 'https://placehold.co/400x400/f3f4f6/94a3b8?text=No+Image'}
          alt={product.name}
          className={`w-full h-64 md:h-72 object-cover transition-transform duration-700 ${
            isAvailable ? 'group-hover:scale-110' : ''
          }`}
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x400/f3f4f6/94a3b8?text=No+Image'
          }}
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          !isAvailable ? 'bg-black/40' : 'bg-navy/0 group-hover:bg-navy/20'
        }`} />
        
        {/* Sold Out Badge */}
        {!isAvailable && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl transform -rotate-12">
            SOLD OUT
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && isAvailable && (
          <div className="absolute top-3 left-3 bg-gold text-navy text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
            Featured
          </div>
        )}

        {/* Stock Badge */}
        {isAvailable && (
          <div className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider ${
            isLowStock ? 'bg-orange-500 text-white animate-pulse' : 'bg-green-500 text-white'
          }`}>
            {isLowStock ? `Only ${stock} left!` : 'In Stock'}
          </div>
        )}

        {/* Quick Actions */}
        {isAvailable && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleWishlist}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all hover:scale-110"
              title="Add to Wishlist"
            >
              <FiHeart className="w-4 h-4 text-gray-700 dark:text-gray-200 hover:text-red-500 transition-colors" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gold/20 transition-all hover:scale-110"
              title="Quick Add to Cart"
            >
              <FiShoppingCart className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="text-[11px] font-semibold text-gold uppercase tracking-wider">
          {product.category}
        </span>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-1.5 mb-2 hover:text-gold transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Stock Indicator */}
        <div className="flex items-center space-x-1 mb-3">
          <FiPackage className="w-3 h-3 text-gray-400" />
          {isAvailable ? (
            <span className={`text-xs font-medium ${
              isLowStock ? 'text-orange-500' : 'text-green-500'
            }`}>
              {isLowStock ? `Hurry! Only ${stock} left` : `${stock} in stock`}
            </span>
          ) : (
            <span className="text-xs font-medium text-red-500">Out of stock</span>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xl font-bold text-gold">
            C${Number(product.price).toFixed(2)}
          </span>
          
          {isAvailable ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-1.5 bg-navy dark:bg-gold text-white dark:text-navy px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-yellow-600 transition-all duration-300 active:scale-95"
            >
              <FiShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center space-x-1.5 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              <span>Unavailable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


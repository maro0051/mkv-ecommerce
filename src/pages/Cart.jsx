import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { supabase } from '../services/supabase'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart, updateCartItem } = useCart()
  const [productVariants, setProductVariants] = useState({})
  const [loadingVariants, setLoadingVariants] = useState({})

  useEffect(() => {
    cart.forEach(item => {
      if (!productVariants[item.id]) {
        loadVariants(item.id)
      }
    })
  }, [cart])

  const loadVariants = async (productId) => {
    setLoadingVariants(prev => ({ ...prev, [productId]: true }))
    try {
      const { data } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .eq('is_available', true)

      setProductVariants(prev => ({ ...prev, [productId]: data || [] }))
    } catch (error) {
      console.error('Error loading variants:', error)
    } finally {
      setLoadingVariants(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleVariantChange = (item, variant) => {
    const newPrice = Number(item.price) + Number(variant.price_adjustment || 0)
    const updatedItem = {
      ...item,
      selectedVariant: variant,
      variantName: `${variant.name}: ${variant.value}`,
      price: newPrice,
      variantId: variant.id
    }
    updateCartItem(item.id, updatedItem)
  }

  const colorMap = {
    'black': '#000000', 'white': '#FFFFFF', 'gold': '#D4AF37',
    'silver': '#C0C0C0', 'rose gold': '#E8B4B8', 'navy': '#0F172A',
    'red': '#EF4444', 'blue': '#3B82F6', 'green': '#10B981',
    'purple': '#8B5CF6', 'pink': '#EC4899', 'brown': '#92400E',
    'gray': '#6B7280', 'grey': '#6B7280', 'orange': '#F97316',
  }

  const getColorHex = (colorName) => {
    return colorMap[colorName?.toLowerCase()] || '#CCCCCC'
  }

  // Calculate totals (CAD + 15% HST for Nova Scotia)
  const subtotal = cartTotal
  const shipping = subtotal >= 100 ? 0 : 15
  const tax = subtotal * 0.15
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <FiShoppingCart className="w-14 h-14 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-navy dark:text-white mb-3">Your Cart is Empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Browse our collection and find something you love!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="bg-gold text-navy px-8 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-all shadow-lg">
                Browse Products 🛍️
              </Link>
              <Link to="/" className="border-2 border-gray-300 dark:border-gray-600 text-navy dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Back to Home
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                { icon: <FiTruck className="w-5 h-5" />, text: 'Free Shipping', sub: 'Over C$100' },
                { icon: <FiShield className="w-5 h-5" />, text: 'Secure Checkout', sub: 'Protected' },
                { icon: <FiRefreshCw className="w-5 h-5" />, text: 'Easy Returns', sub: '30 Days' },
              ].map((f, i) => (
                <div key={i} className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <div className="text-gold mb-2 flex justify-center">{f.icon}</div>
                  <p className="text-xs font-semibold text-navy dark:text-white">{f.text}</p>
                  <p className="text-[10px] text-gray-400">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy">
      <div className="container-custom py-8 md:py-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy dark:text-white">Shopping Cart</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/shop" className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gold transition-colors">
              <FiArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Continue Shopping</span>
            </Link>
            <button onClick={clearCart} className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium text-sm transition-colors">
              <FiTrash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const variants = productVariants[item.id] || []
              const colorVariants = variants.filter(v => v.name === 'Color')
              const otherVariants = variants.filter(v => v.name !== 'Color')
              const isLoadingVariants = loadingVariants[item.id]

              return (
                <div key={item.uniqueId || item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    
                    {/* Product Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.selectedVariant?.image_url || item.image_url || 'https://placehold.co/120x120'}
                        alt={item.name}
                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl"
                        onError={(e) => { e.target.src = 'https://placehold.co/120x120/f3f4f6/94a3b8?text=No+Image' }}
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-lg font-semibold text-navy dark:text-white hover:text-gold transition-colors mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.category}</p>

                      {/* Color Variant Selector */}
                      {colorVariants.length > 0 && (
                        <div className="mb-3">
                          <label className="block text-xs font-semibold text-gray-500 mb-2">
                            Color: <span className="text-gold">{item.selectedVariant?.value || 'Select'}</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {isLoadingVariants ? (
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                            ) : (
                              colorVariants.map((variant) => {
                                const isSelected = item.selectedVariant?.id === variant.id
                                const hasImage = !!variant.image_url
                                const isOutOfStock = variant.stock <= 0

                                return (
                                  <button
                                    key={variant.id}
                                    onClick={() => !isOutOfStock && handleVariantChange(item, variant)}
                                    disabled={isOutOfStock}
                                    className={`relative transition-all duration-200 ${
                                      isSelected ? 'scale-110' : 'hover:scale-105'
                                    } ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                                    title={`${variant.value}${isOutOfStock ? ' (Out of Stock)' : ''}${variant.price_adjustment > 0 ? ` (+C$${variant.price_adjustment})` : ''}`}
                                  >
                                    {hasImage ? (
                                      <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${
                                        isSelected ? 'border-gold ring-2 ring-gold ring-offset-1' : 'border-gray-300 dark:border-gray-500'
                                      }`}>
                                        <img src={variant.image_url} alt={variant.value} className="w-full h-full object-cover"
                                          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = getColorHex(variant.value) }} />
                                      </div>
                                    ) : (
                                      <div className={`w-10 h-10 rounded-full border-2 ${
                                        isSelected ? 'border-gold ring-2 ring-gold ring-offset-1' : 'border-gray-300 dark:border-gray-500'
                                      }`} style={{ backgroundColor: getColorHex(variant.value) }} />
                                    )}
                                    <p className="text-[9px] text-center mt-0.5 text-gray-500">{variant.value}</p>
                                  </button>
                                )
                              })
                            )}
                          </div>
                        </div>
                      )}

                      {/* Other Variants */}
                      {otherVariants.length > 0 && otherVariants.map(group => {
                        const groupedByName = {}
                        otherVariants.forEach(v => {
                          if (!groupedByName[v.name]) groupedByName[v.name] = []
                          groupedByName[v.name].push(v)
                        })
                        
                        return Object.entries(groupedByName).map(([name, items]) => (
                          <div key={name} className="mb-3">
                            <label className="block text-xs font-semibold text-gray-500 mb-2">
                              {name}: <span className="text-gold">{item.selectedVariant?.name === name ? item.selectedVariant?.value : 'Select'}</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {items.map(variant => (
                                <button
                                  key={variant.id}
                                  onClick={() => variant.stock > 0 && handleVariantChange(item, variant)}
                                  disabled={variant.stock <= 0}
                                  className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${
                                    item.selectedVariant?.id === variant.id
                                      ? 'border-gold bg-gold/10 text-navy dark:text-white'
                                      : 'border-gray-200 dark:border-gray-600 hover:border-gold'
                                  } ${variant.stock <= 0 ? 'opacity-40 line-through cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  {variant.value}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      })}

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-gold">
                          C${Number(item.price).toFixed(2)}
                        </span>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                            >
                              <FiMinus className="w-4 h-4 text-navy dark:text-white" />
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold text-navy dark:text-white border-x-2 border-gray-200 dark:border-gray-600 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <FiPlus className="w-4 h-4 text-navy dark:text-white" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-lg font-bold text-navy dark:text-white">
                      C${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 sticky top-28">
              <h2 className="text-xl font-serif font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
                <span>📋</span>
                <span>Order Summary</span>
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-navy dark:text-white">C${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-semibold">FREE</span>
                  ) : (
                    <span className="text-navy dark:text-white font-semibold">C${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">HST (15%)</span>
                  <span className="text-navy dark:text-white font-semibold">C${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-navy dark:text-white">Total</span>
                    <span className="text-2xl md:text-3xl font-bold text-gold">C${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 100 && subtotal > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Add C${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              <Link to="/checkout"
                className="w-full flex items-center justify-center space-x-2 bg-gold text-navy py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-all shadow-lg">
                <span>💳</span>
                <span>Proceed to Checkout</span>
              </Link>

              <Link to="/shop" className="flex items-center justify-center space-x-2 text-gray-500 hover:text-gold font-medium text-sm transition-colors mt-4">
                <FiArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2">
                    <FiTruck className="w-4 h-4 text-gold mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Free Shipping over C$100</p>
                  </div>
                  <div className="p-2">
                    <FiShield className="w-4 h-4 text-gold mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Secure Checkout</p>
                  </div>
                  <div className="p-2">
                    <FiRefreshCw className="w-4 h-4 text-gold mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">30-Day Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


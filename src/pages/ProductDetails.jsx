import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw, FiPackage } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { fetchProductById, fetchProducts, supabase } from '../services/supabase'
import ProductCard from '../components/ProductCard'
import ProductVariantSelector from '../components/ProductVariantSelector'
import ProductImageGallery from '../components/ProductImageGallery'
import ReviewSection from '../components/ReviewSection'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [productImages, setProductImages] = useState([])

  useEffect(() => {
    loadProduct()
    window.scrollTo(0, 0)
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const productData = await fetchProductById(id)
      
      if (!productData) {
        toast.error('Product not found')
        setLoading(false)
        return
      }

      setProduct(productData)
      setQuantity(1)
      setIsWishlisted(false)

      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productData.id)
        .order('sort_order')

      setProductImages(imagesData || [])

      const { data: variantData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productData.id)
        .eq('is_available', true)

      setVariants(variantData || [])
      if (variantData && variantData.length > 0) setSelectedVariant(variantData[0])

      const allProducts = await fetchProducts()
      const related = allProducts
        .filter(p => p.category === productData.category && p.id !== productData.id)
        .slice(0, 4)
      setRelatedProducts(related)

    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    const maxStock = getStock()
    if (newQuantity >= 1 && newQuantity <= maxStock) setQuantity(newQuantity)
  }

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value)
    const maxStock = getStock()
    if (!isNaN(value) && value >= 1 && value <= maxStock) setQuantity(value)
    else if (e.target.value === '') setQuantity('')
  }

  const handleQuantityBlur = () => {
    const maxStock = getStock()
    if (quantity === '' || quantity < 1) setQuantity(1)
    if (quantity > maxStock) { setQuantity(maxStock); toast.error(`Only ${maxStock} items available`) }
  }

  const handleAddToCart = () => {
    if (!product) return
    const stock = getStock()
    if (stock <= 0) { toast.error('This product is currently unavailable'); return }
    if (quantity > stock) { toast.error(`Only ${stock} items available`); return }

    const cartProduct = {
      ...product,
      price: getDisplayPrice(),
      selectedVariant: selectedVariant,
      variantName: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : null
    }

    addToCart(cartProduct, quantity)
    setQuantity(1)
    toast.success(`${quantity} × ${product.name} added to cart`, { icon: '🛍️' })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: isWishlisted ? '💔' : '❤️' })
  }

  const getDisplayPrice = () => {
    let price = Number(product?.price || 0)
    if (selectedVariant?.price_adjustment) price += Number(selectedVariant.price_adjustment)
    return price
  }

  const getStock = () => {
    if (selectedVariant) return selectedVariant.stock || 0
    return product?.stock || 0
  }

  const getSelectedColor = () => {
    if (!selectedVariant) return null
    if (selectedVariant.name?.toLowerCase() === 'color') return selectedVariant.value
    return null
  }

  if (loading) return <LoadingSpinner />
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy">
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-navy dark:text-white mb-2">Product Not Found</h2>
          <Link to="/shop" className="inline-flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600">
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    )
  }

  const stock = getStock()
  const isAvailable = stock > 0
  const isLowStock = stock > 0 && stock <= 5
  const displayPrice = getDisplayPrice()
  const selectedColor = getSelectedColor()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy">
      <div className="container-custom py-8 md:py-12">
        
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gold transition-colors group">
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Shop</span>
          </Link>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-gold">Shop</Link>
            <span>/</span>
            <span className="text-gold font-medium truncate">{product.name}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            <div className="relative p-4 md:p-6 bg-gray-50 dark:bg-gray-700/50">
              <ProductImageGallery 
                images={productImages}
                productImage={product.image_url}
                selectedColor={selectedColor}
              />
              
              {product.featured && (
                <div className="absolute top-6 left-6 bg-gold text-navy text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider z-10">
                  Featured
                </div>
              )}

              {!isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-2xl transform -rotate-12">SOLD OUT</div>
                </div>
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              
              <span className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-2">{product.category}</span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-navy dark:text-white mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (<FiStar key={i} className="w-4 h-4 fill-current" />))}
                </div>
                <span className="text-sm text-gray-500">(0 reviews)</span>
              </div>

              <div className="mb-6">
                <p className="text-3xl md:text-4xl font-bold text-gold">C${displayPrice.toFixed(2)}</p>
                {selectedVariant?.price_adjustment > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Includes C${selectedVariant.price_adjustment.toFixed(2)} variant adjustment</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Free shipping on orders over C$100</p>
              </div>

              <div className="mb-6 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 flex items-center space-x-3">
                <FiPackage className="w-5 h-5 text-gray-400" />
                {isAvailable ? (
                  <>
                    <div className={`w-3 h-3 rounded-full ${isLowStock ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                    <div>
                      <p className={`font-semibold ${isLowStock ? 'text-orange-500' : 'text-green-500'}`}>{isLowStock ? 'Low Stock!' : 'In Stock'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stock} {stock === 1 ? 'item' : 'items'} available</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div><p className="font-semibold text-red-500">Out of Stock</p></div>
                  </>
                )}
              </div>

              {variants.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <ProductVariantSelector 
                    variants={variants}
                    selectedVariant={selectedVariant}
                    onSelect={setSelectedVariant}
                    productImages={productImages}
                  />
                  {selectedVariant?.price_adjustment > 0 && (
                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      +C${selectedVariant.price_adjustment.toFixed(2)} for {selectedVariant.value}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-navy dark:text-white uppercase tracking-wider mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              {isAvailable && (
                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
                  <label className="block text-sm font-semibold text-navy dark:text-white uppercase tracking-wider mb-4">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-500 text-navy dark:text-white hover:border-gold disabled:opacity-30 transition-all bg-white dark:bg-gray-800 font-bold text-lg">
                      <FiMinus className="w-5 h-5" />
                    </button>
                    <input type="number" min="1" max={stock} value={quantity} onChange={handleQuantityInput} onBlur={handleQuantityBlur}
                      className="w-20 h-12 text-center text-lg font-bold rounded-xl border-2 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-navy dark:text-white focus:outline-none focus:border-gold transition-all" />
                    <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= stock}
                      className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-300 dark:border-gray-500 text-navy dark:text-white hover:border-gold disabled:opacity-30 transition-all bg-white dark:bg-gray-800 font-bold text-lg">
                      <FiPlus className="w-5 h-5" />
                    </button>
                    <div className="flex items-center space-x-2">
                      {[2, 3, 5].filter(n => n <= stock).map(num => (
                        <button key={num} onClick={() => setQuantity(num)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            quantity === num ? 'bg-gold text-navy border-2 border-gold' : 'bg-white dark:bg-gray-800 text-navy dark:text-white border-2 border-gray-300 dark:border-gray-500 hover:border-gold'
                          }`}>{num}</button>
                      ))}
                    </div>
                  </div>

                  {isLowStock && (
                    <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-xl">
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">⚠️ Hurry! Only {stock} left!</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="text-xl font-bold text-gold">C${(displayPrice * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={handleAddToCart} disabled={!isAvailable}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                    isAvailable ? 'bg-gold text-navy hover:bg-yellow-600' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  }`}>
                  <FiShoppingCart className="w-5 h-5" />
                  <span>{isAvailable ? `Add to Cart — C$${(displayPrice * quantity).toFixed(2)}` : 'Out of Stock'}</span>
                </button>
                <button onClick={handleWishlist}
                  className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold border-2 transition-all ${
                    isWishlisted ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-600' : 'border-gray-300 dark:border-gray-600 text-navy dark:text-white hover:border-gold'
                  }`}>
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                {[
                  { icon: <FiTruck className="w-4 h-4" />, text: 'Free Shipping', sub: 'Over C$100' },
                  { icon: <FiShield className="w-4 h-4" />, text: 'Secure Payment', sub: 'Protected' },
                  { icon: <FiRefreshCw className="w-4 h-4" />, text: 'Easy Returns', sub: '30 Days' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <span className="text-gold flex-shrink-0">{feature.icon}</span>
                    <div>
                      <p className="font-medium text-navy dark:text-white text-xs">{feature.text}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{feature.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <ReviewSection productId={product.id} />
        </section>

        {relatedProducts.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <span className="text-gold font-semibold text-xs uppercase tracking-[0.2em]">You Might Also Like</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mt-2 mb-2 text-navy dark:text-white">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (<ProductCard key={rp.id} product={rp} />))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}


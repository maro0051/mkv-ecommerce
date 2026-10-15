import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiSave, FiArrowLeft, FiUpload, FiX, FiImage, FiPackage, FiPlus, FiTrash2 } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import ProductImageUploader from '../../components/admin/ProductImageUploader'
import { createProduct, updateProduct, getProductById, getAllCategories, uploadProductImage } from '../../services/adminService'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

export default function AdminProductForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    featured: false,
    stock: 10,
    is_available: true
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [productImages, setProductImages] = useState([])
  const [variants, setVariants] = useState([
    { id: Date.now(), name: 'Color', value: '', image_url: '', stock: 10, price_adjustment: 0 }
  ])

  useEffect(() => {
    loadCategories()
    if (isEditing) {
      loadProduct()
    }
  }, [id])

  const loadCategories = async () => {
    try {
      const data = await getAllCategories()
      setCategories(data || [])
      if (!isEditing && data && data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0].name }))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const loadProduct = async () => {
    try {
      const product = await getProductById(id)
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || '',
          image_url: product.image_url || '',
          featured: product.featured || false,
          stock: product.stock || 0,
          is_available: product.is_available !== false
        })
        if (product.image_url) {
          setImagePreview(product.image_url)
        }

        const { data: imagesData } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', id)
          .order('sort_order')

        setProductImages(imagesData || [])

        const { data: existingVariants } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', id)

        if (existingVariants && existingVariants.length > 0) {
          setVariants(existingVariants.map(v => ({
            id: v.id,
            name: v.name,
            value: v.value,
            image_url: v.image_url || '',
            stock: v.stock || 10,
            price_adjustment: v.price_adjustment || 0
          })))
        }
      }
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Product not found')
      navigate('/admin/products')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const imageUrl = await uploadProductImage(file)
      setFormData(prev => ({ ...prev, image_url: imageUrl }))
      toast.success('Image uploaded! 📸')
    } catch (error) {
      toast.error(error.message || 'Failed to upload')
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }))
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const addVariant = () => {
    setVariants([...variants, { 
      id: Date.now(), name: 'Color', value: '', image_url: '', stock: 10, price_adjustment: 0 
    }])
  }

  const removeVariant = (variantId) => {
    if (variants.length <= 1) {
      toast.error('At least one variant is required')
      return
    }
    setVariants(variants.filter(v => v.id !== variantId))
  }

  const updateVariant = (variantId, field, value) => {
    setVariants(variants.map(v => 
      v.id === variantId ? { ...v, [field]: value } : v
    ))
  }

  const handleVariantImageUpload = async (variantId, e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const imageUrl = await uploadProductImage(file)
      updateVariant(variantId, 'image_url', imageUrl)
      toast.success('Variant image uploaded! 📸')
    } catch (error) {
      toast.error(error.message || 'Failed to upload')
    } finally {
      setUploading(false)
    }
  }

  const saveImages = async (productId) => {
    if (isEditing) {
      await supabase.from('product_images').delete().eq('product_id', productId)
    }
    
    for (const image of productImages) {
      if (image.image_url) {
        await supabase.from('product_images').insert([{
          product_id: productId,
          image_url: image.image_url,
          color_name: image.color_name || '',
          color_hex: image.color_hex || '',
          is_primary: image.is_primary || false,
          sort_order: image.sort_order || 0
        }])
      }
    }
  }

  const saveVariants = async (productId) => {
    if (isEditing) {
      await supabase.from('product_variants').delete().eq('product_id', productId)
    }

    for (const variant of variants) {
      if (variant.value.trim()) {
        await supabase.from('product_variants').insert([{
          product_id: productId,
          name: variant.name,
          value: variant.value,
          image_url: variant.image_url || formData.image_url,
          stock: parseInt(variant.stock) || 10,
          price_adjustment: parseFloat(variant.price_adjustment) || 0
        }])
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) { toast.error('Product name is required'); return }
    if (!formData.price || Number(formData.price) <= 0) { toast.error('Please enter a valid price'); return }
    if (!formData.category) { toast.error('Please select a category'); return }

    setLoading(true)
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        is_available: parseInt(formData.stock) > 0 && formData.is_available,
        image_url: productImages.find(img => img.is_primary)?.image_url || formData.image_url
      }

      let productId = id

      if (isEditing) {
        await updateProduct(id, productData)
        toast.success('Product updated! ✅')
      } else {
        const newProduct = await createProduct(productData)
        productId = newProduct.id
        toast.success('Product created! 🎉')
      }

      await saveImages(productId)
      await saveVariants(productId)
      
      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Back">
          <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update product information' : 'Create a new product in your catalog'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-navy dark:text-white mb-6">📋 Basic Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    placeholder="e.g., Royal Oud Perfume"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy dark:text-white mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                    placeholder="Describe your product..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                      Price (CAD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">C$</span>
                      <input type="number" name="price" value={formData.price} onChange={handleChange} required
                        min="0" step="0.01" placeholder="99.99"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select name="category" value={formData.category} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white focus:outline-none focus:border-gold transition-all">
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                      <FiPackage className="w-3 h-3 inline mr-1" />Stock
                    </label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                      min="0" placeholder="10"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
                <span>🖼️</span>
                <span>Product Images</span>
                <span className="text-xs text-gray-400 font-normal">({productImages.length} images)</span>
              </h2>
              
              <ProductImageUploader 
                images={productImages}
                onImagesChange={setProductImages}
              />
            </div>

            {/* Product Variants */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-navy dark:text-white flex items-center space-x-2">
                  <span>🎨</span>
                  <span>Product Variants (Colors, Sizes, etc.)</span>
                </h2>
                <button type="button" onClick={addVariant}
                  className="flex items-center space-x-2 bg-gold/10 text-gold px-4 py-2 rounded-xl font-semibold hover:bg-gold/20 transition-all text-sm">
                  <FiPlus className="w-4 h-4" />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-navy dark:text-white">Variant #{index + 1}</span>
                      <button type="button" onClick={() => removeVariant(variant.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Type</label>
                        <select value={variant.name} onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-navy dark:text-white">
                          <option value="Color">Color</option>
                          <option value="Size">Size</option>
                          <option value="Style">Style</option>
                          <option value="Material">Material</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Value</label>
                        <input type="text" value={variant.value} onChange={(e) => updateVariant(variant.id, 'value', e.target.value)}
                          placeholder="e.g., Gold, XL"
                          className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-navy dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Stock</label>
                        <input type="number" value={variant.stock} onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)}
                          min="0" className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-navy dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Price Adj. (C$)</label>
                        <input type="number" value={variant.price_adjustment} onChange={(e) => updateVariant(variant.id, 'price_adjustment', e.target.value)}
                          step="0.01" placeholder="0.00"
                          className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-navy dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Image</label>
                        <label className="flex items-center justify-center px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 cursor-pointer hover:border-gold transition-colors text-gray-400">
                          <FiUpload className="w-4 h-4" />
                          <input type="file" accept="image/*" onChange={(e) => handleVariantImageUpload(variant.id, e)}
                            className="hidden" disabled={uploading} />
                        </label>
                        {variant.image_url && (
                          <p className="text-[10px] text-green-500 mt-1 truncate">✓ Image set</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Add variants for colors, sizes, or styles. Each variant can have its own stock, price adjustment, and image.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
              <h2 className="text-lg font-bold text-navy dark:text-white mb-6">⚙️ Settings</h2>
              
              <div className="space-y-5">
                <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 transition-colors">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold focus:ring-2" />
                  <div>
                    <span className="text-sm font-semibold text-navy dark:text-white block">Featured Product</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Show on homepage</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 transition-colors">
                  <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold focus:ring-2" />
                  <div>
                    <span className="text-sm font-semibold text-navy dark:text-white block">Available for Purchase</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.is_available ? 'Product is visible' : 'Hidden from shop'}
                    </span>
                  </div>
                </label>

                <button type="submit" disabled={loading || uploading}
                  className="w-full flex items-center justify-center space-x-2 bg-gold text-navy py-4 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50 transform hover:scale-[1.02] active:scale-95 shadow-lg">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" /><span>Saving...</span></>
                  ) : (
                    <><FiSave className="w-5 h-5" /><span>{isEditing ? 'Update Product' : 'Create Product'}</span></>
                  )}
                </button>

                <button type="button" onClick={() => navigate('/admin/products')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">💡 Tips</h3>
              <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1.5">
                <li>• Upload multiple images for different colors</li>
                <li>• Set primary image for main display</li>
                <li>• Add variants for sizes, colors, styles</li>
                <li>• Each variant has its own stock & price</li>
                <li>• Upload variant-specific images</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}


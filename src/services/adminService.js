import { supabase } from './supabase'

// ============================================
// PRODUCTS CRUD
// ============================================

// Get all products
export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting all products:', error)
    throw error
  }
  return data || []
}

// Get single product by ID
export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error getting product:', error)
    throw error
  }
  return data
}

// Create new product
export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw error
  }
  return data
}

// Update existing product
export const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }
  return data
}

// Delete product
export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
  return true
}

// ============================================
// CATEGORIES CRUD
// ============================================

// Get all categories
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error getting categories:', error)
    throw error
  }
  return data || []
}

// Get single category by ID
export const getCategoryById = async (id) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error getting category:', error)
    throw error
  }
  return data
}

// Create new category
export const createCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    throw error
  }
  return data
}

// Update existing category
export const updateCategory = async (id, categoryData) => {
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    throw error
  }
  return data
}

// Delete category
export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    throw error
  }
  return true
}

// ============================================
// CONTACTS / MESSAGES
// ============================================

// Get all contact messages
export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting contacts:', error)
    throw error
  }
  return data || []
}

// Get single contact by ID
export const getContactById = async (id) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error getting contact:', error)
    throw error
  }
  return data
}

// Delete contact message
export const deleteContact = async (id) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting contact:', error)
    throw error
  }
  return true
}

// ============================================
// IMAGE UPLOAD
// ============================================

export const uploadProductImage = async (file) => {
  try {
    // Validate file exists
    if (!file) {
      throw new Error('No file selected')
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed')
    }

    console.log('Starting upload:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB')

    // Create unique filename
    const fileExtension = file.name.split('.').pop().toLowerCase()
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    const fileName = `${uniqueName}.${fileExtension}`
    const filePath = fileName // Store directly in bucket root

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      
      // Handle specific errors
      if (error.message.includes('duplicate')) {
        throw new Error('A file with this name already exists. Please try again.')
      }
      if (error.message.includes('not found')) {
        throw new Error('Storage bucket not found. Please create "product-images" bucket in Supabase.')
      }
      if (error.message.includes('permission') || error.message.includes('policy')) {
        throw new Error('Permission denied. Check storage bucket policies in Supabase.')
      }
      
      throw new Error(error.message || 'Failed to upload image')
    }

    console.log('Upload successful:', data)

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    console.log('Public URL:', publicUrl)
    
    return publicUrl

  } catch (error) {
    console.error('Image upload failed:', error.message)
    throw error
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const [products, categories, contacts] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
      getContacts()
    ])

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalMessages: contacts.length,
      featuredProducts: products.filter(p => p.featured).length,
      totalValue: products.reduce((sum, p) => sum + Number(p.price || 0), 0),
      recentProducts: products.slice(0, 5),
      recentMessages: contacts.slice(0, 5)
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    throw error
  }
}


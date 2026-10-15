import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

// Create single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'mkv-auth-token',
  }
})

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email || 'No user')
})

// ===== PRODUCTS =====
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }
  return data || []
}

export const fetchFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(8)
  
  if (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
  return data || []
}

export const fetchProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
  
    if (error) {
      console.error('Error fetching product:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error in fetchProductById:', error)
    return null
  }
}

// ===== CATEGORIES =====
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
  return data || []
}

// ===== CONTACT =====
export const submitContact = async (contactData) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contactData])
  
  if (error) {
    console.error('Error submitting contact:', error)
    throw error
  }
  return data
}

// ===== NEWSLETTER =====
export const subscribeNewsletter = async (email) => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }])
  
  if (error) {
    // Ignore duplicate email errors
    if (error.code === '23505') {
      return { message: 'Already subscribed' }
    }
    throw error
  }
  return data
}


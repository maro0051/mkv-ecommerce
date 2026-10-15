import { supabase } from './supabase'

export const quickSearch = async (term) => {
  if (!term || term.length < 2) return []

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, image_url, category')
      .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(8)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Quick search error:', error)
    return []
  }
}


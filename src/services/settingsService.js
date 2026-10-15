import { supabase } from './supabase'

// Get store settings
export const getStoreSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error loading settings:', error)
    return null
  }
}

// Update store settings
export const updateStoreSettings = async (settings) => {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}


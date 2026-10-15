import { supabase } from './supabase'

// Get all orders
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
    return data || []
  } catch (error) {
    console.error('getAllOrders error:', error)
    return []
  }
}

// Get single order by ID
export const getOrderById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('getOrderById error:', error)
    return null
  }
}

// Update order status - using PATCH-like approach
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log('Updating order:', orderId, 'to status:', status)
    
    // Try different update methods
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: status
      })
      .match({ id: orderId })  // Use match instead of eq
      .select()

    if (error) {
      console.error('Error updating order:', error)
      
      // Try alternative method
      const { data: data2, error: error2 } = await supabase
        .rpc('update_order_status', {
          order_id: orderId,
          new_status: status
        })
      
      if (error2) {
        console.error('RPC error:', error2)
        throw error2
      }
      
      return data2
    }
    
    console.log('Order updated:', data)
    return data?.[0] || data
  } catch (error) {
    console.error('updateOrderStatus error:', error)
    throw error
  }
}
// Delete order
export const deleteOrder = async (orderId) => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('deleteOrder error:', error)
    throw error
  }
}

// Get order counts by status
export const getOrderCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status')

    if (error) throw error

    const counts = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      declined: 0,
      total: data?.length || 0
    }

    if (data) {
      data.forEach(order => {
        if (counts[order.status] !== undefined) {
          counts[order.status]++
        }
      })
    }

    return counts
  } catch (error) {
    console.error('getOrderCounts error:', error)
    return { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, declined: 0, total: 0 }
  }
}


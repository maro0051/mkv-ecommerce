import { supabase } from './supabase'

/**
 * Get total revenue
 */
export const getTotalRevenue = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('total')
    .eq('status', 'completed')

  if (error) throw error
  return data.reduce((sum, order) => sum + Number(order.total), 0)
}

/**
 * Get total orders count
 */
export const getTotalOrders = async () => {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count || 0
}

/**
 * Get orders by status
 */
export const getOrdersByStatus = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('status')

  if (error) throw error
  
  const statusCounts = {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  }
  
  data.forEach(order => {
    if (statusCounts[order.status] !== undefined) {
      statusCounts[order.status]++
    }
  })
  
  return statusCounts
}

/**
 * Get recent orders
 */
export const getRecentOrders = async (limit = 10) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get revenue by month (last 6 months)
 */
export const getRevenueByMonth = async () => {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('status', 'completed')
    .gte('created_at', sixMonthsAgo.toISOString())
    .order('created_at')

  if (error) throw error

  const monthlyRevenue = {}
  data.forEach(order => {
    const month = new Date(order.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.total)
  })

  return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue
  }))
}

/**
 * Get top selling products
 */
export const getTopProducts = async () => {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_name, quantity, price')

  if (error) throw error

  const productSales = {}
  data.forEach(item => {
    if (!productSales[item.product_name]) {
      productSales[item.product_name] = { name: item.product_name, quantity: 0, revenue: 0 }
    }
    productSales[item.product_name].quantity += item.quantity
    productSales[item.product_name].revenue += item.quantity * Number(item.price)
  })

  return Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}

/**
 * Get dashboard stats
 */
export const getDashboardAnalytics = async () => {
  try {
    const [totalRevenue, totalOrders, ordersByStatus, recentOrders, revenueByMonth, topProducts] = 
      await Promise.all([
        getTotalRevenue(),
        getTotalOrders(),
        getOrdersByStatus(),
        getRecentOrders(5),
        getRevenueByMonth(),
        getTopProducts()
      ])

    return {
      totalRevenue,
      totalOrders,
      ordersByStatus,
      recentOrders,
      revenueByMonth,
      topProducts
    }
  } catch (error) {
    console.error('Error loading analytics:', error)
    throw error
  }
}


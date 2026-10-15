import { useEffect, useState } from 'react'
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiPackage, FiClock, FiCheckCircle, FiLoader } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { getDashboardAnalytics } from '../../services/analyticsService'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await getDashboardAnalytics()
      setAnalytics(data)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-500">{error}</p>
          <button onClick={loadAnalytics} className="mt-4 bg-gold text-navy px-6 py-2 rounded-lg">Retry</button>
        </div>
      </AdminLayout>
    )
  }

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${analytics?.totalRevenue?.toLocaleString() || '0'}`, 
      icon: <FiDollarSign className="w-6 h-6" />,
      change: '+12.5%',
      positive: true,
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Total Orders', 
      value: analytics?.totalOrders || 0, 
      icon: <FiShoppingCart className="w-6 h-6" />,
      change: '+8.2%',
      positive: true,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Pending Orders', 
      value: analytics?.ordersByStatus?.pending || 0, 
      icon: <FiClock className="w-6 h-6" />,
      change: 'Needs attention',
      positive: false,
      color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    { 
      label: 'Completed', 
      value: analytics?.ordersByStatus?.completed || 0, 
      icon: <FiCheckCircle className="w-6 h-6" />,
      change: 'This month',
      positive: true,
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200',
      iconColor: 'text-purple-600'
    },
  ]

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your store's performance and sales
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} border-2 rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-md ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold ${stat.positive ? 'text-green-500' : 'text-yellow-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-navy dark:text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Chart (Simple Bar Chart) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-navy dark:text-white mb-6">Revenue (Last 6 Months)</h2>
          
          {analytics?.revenueByMonth?.length > 0 ? (
            <div className="space-y-4">
              {analytics.revenueByMonth.map((item, idx) => {
                const maxRevenue = Math.max(...analytics.revenueByMonth.map(i => i.revenue))
                const percentage = (item.revenue / maxRevenue) * 100
                
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{item.month}</span>
                      <span className="font-semibold text-navy dark:text-white">${item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gold h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No revenue data yet</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-navy dark:text-white mb-6">Top Selling Products</h2>
          
          {analytics?.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {analytics.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-gold/20 text-gold rounded-full flex items-center justify-center font-bold text-sm">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-navy dark:text-white text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.quantity} sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-gold">${product.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No sales data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-navy dark:text-white mb-6">Recent Orders</h2>
          
          {analytics?.recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right p-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {analytics.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="p-3 font-medium text-navy dark:text-white">{order.order_number}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{order.customer_name}</td>
                      <td className="p-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-navy dark:text-white">${Number(order.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No orders yet</p>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}


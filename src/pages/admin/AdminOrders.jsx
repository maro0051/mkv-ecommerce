import { useEffect, useState } from 'react'
import { FiSearch, FiEye, FiCheck, FiX, FiTruck, FiPackage, FiClock, FiRefreshCw, FiXCircle, FiPhone, FiMail } from 'react-icons/fi'
import { SiPaypal } from 'react-icons/si'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllOrders, updateOrderStatus, getOrderCounts } from '../../services/orderService'
import { downloadInvoice } from '../../services/invoiceService'
import { 
  sendOrderConfirmedEmail, 
  sendOrderProcessingEmail, 
  sendOrderShippedEmail, 
  sendOrderDeliveredEmail, 
  sendOrderCancelledEmail,
  sendOrderDeclinedEmail,
  sendAdminStatusChange
} from '../../services/emailService'
import { useAdminLanguage } from '../../context/AdminLanguageContext'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)
  const { t } = useAdminLanguage()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const [ordersData, countsData] = await Promise.all([
        getAllOrders(),
        getOrderCounts()
      ])
      setOrders(ordersData)
      setCounts(countsData)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true)
    try {
      const order = orders.find(o => o.id === orderId)
      await updateOrderStatus(orderId, newStatus)

      // 📧 Send status emails to customer and admin
      if (order && order.customer_email) {
        const orderWithStatus = { ...order, status: newStatus }
        
        const emailFns = {
          confirmed: sendOrderConfirmedEmail,
          processing: sendOrderProcessingEmail,
          shipped: sendOrderShippedEmail,
          delivered: sendOrderDeliveredEmail,
          cancelled: sendOrderCancelledEmail,
          declined: sendOrderDeclinedEmail,
        }
        
        const emailFn = emailFns[newStatus]
        if (emailFn) {
          emailFn(order.customer_email, order.customer_name, orderWithStatus)
            .catch(err => console.log('Customer status email failed:', err))
        }

        // Notify admin too
        sendAdminStatusChange(order, newStatus)
          .catch(err => console.log('Admin status email failed:', err))
      }

      const statusMessages = {
        confirmed: '✅ Order approved! Customer notified via email.',
        declined: '❌ Order declined. Customer notified.',
        cancelled: '🚫 Order cancelled. Customer notified.',
        processing: '🔄 Order processing. Customer notified.',
        shipped: '🚚 Order shipped! Customer notified.',
        delivered: '📦 Order delivered! Customer notified.'
      }

      toast.success(statusMessages[newStatus] || `Order ${newStatus}!`)
      await loadOrders()
      setSelectedOrder(null)
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const handleSendInvoice = (order) => {
    const items = order.items || []
    
    downloadInvoice(order, 
      {
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_address: order.customer_address,
        customer_city: order.customer_city,
        customer_state: order.customer_state,
        customer_zip: order.customer_zip,
        customer_phone: order.customer_phone,
      }, 
      items
    )
    
    toast.success('Invoice downloaded! Opening email client...')
    
    setTimeout(() => {
      const subject = `M.K.V Invoice - Order #${order.order_number}`
      const body = `Dear ${order.customer_name},\n\nThank you for your order! Please find your invoice attached.\n\n📋 Order #: ${order.order_number}\n💰 Total: C$${Number(order.total).toFixed(2)}\n\n💳 Payment Instructions:\nSend Interac e-Transfer to: Mkvisionbusiness@gmail.com\nReference: ${order.order_number}\nAmount: C$${Number(order.total).toFixed(2)}\n\nYour order will be processed once payment is received.\n\n📞 Questions? Contact us at +1 418 490 1884\n\nThank you for shopping with M.K.V!\n\nBest regards,\nM.K.V Team`
      
      window.open(`mailto:${order.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }, 500)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300',
      declined: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300',
    }
    return badges[status] || badges.pending
  }

  const getPaymentBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
    return badges[status] || badges.pending
  }

  const getPaymentMethodBadge = (method) => {
    if (method === 'paypal') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300">
          <SiPaypal className="w-3 h-3" />
          <span>PayPal</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-navy/10 text-navy dark:bg-gold/20 dark:text-gold border border-navy/20">
        <span>🏦</span>
        <span>Interac</span>
      </span>
    )
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FiClock className="w-4 h-4" />,
      confirmed: <FiCheck className="w-4 h-4" />,
      processing: <FiRefreshCw className="w-4 h-4" />,
      shipped: <FiTruck className="w-4 h-4" />,
      delivered: <FiPackage className="w-4 h-4" />,
      cancelled: <FiXCircle className="w-4 h-4" />,
      declined: <FiX className="w-4 h-4" />,
    }
    return icons[status] || icons.pending
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getActions = (order) => {
    const actions = []
    
    switch (order.status) {
      case 'pending':
        actions.push(
          { label: t('approve'), icon: <FiCheck />, status: 'confirmed', color: 'bg-green-500 hover:bg-green-600 text-white' },
          { label: t('decline'), icon: <FiX />, status: 'declined', color: 'bg-red-500 hover:bg-red-600 text-white' }
        )
        break
      case 'confirmed':
        actions.push(
          { label: t('process'), icon: <FiRefreshCw />, status: 'processing', color: 'bg-purple-500 hover:bg-purple-600 text-white' },
          { label: t('cancelOrder'), icon: <FiXCircle />, status: 'cancelled', color: 'bg-gray-500 hover:bg-gray-600 text-white' }
        )
        break
      case 'processing':
        actions.push(
          { label: t('ship'), icon: <FiTruck />, status: 'shipped', color: 'bg-indigo-500 hover:bg-indigo-600 text-white' },
          { label: t('cancelOrder'), icon: <FiXCircle />, status: 'cancelled', color: 'bg-gray-500 hover:bg-gray-600 text-white' }
        )
        break
      case 'shipped':
        actions.push(
          { label: t('deliver'), icon: <FiPackage />, status: 'delivered', color: 'bg-green-500 hover:bg-green-600 text-white' }
        )
        break
    }
    
    return actions
  }

  const statusTabs = [
    { key: 'all', label: t('allOrders'), count: counts.total || 0 },
    { key: 'pending', label: t('pending'), count: counts.pending || 0 },
    { key: 'confirmed', label: t('confirmed'), count: counts.confirmed || 0 },
    { key: 'processing', label: t('processing'), count: counts.processing || 0 },
    { key: 'shipped', label: t('shipped'), count: counts.shipped || 0 },
    { key: 'delivered', label: t('delivered'), count: counts.delivered || 0 },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">
          {t('ordersTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {t('ordersSubtitle')} ({counts.total || 0} total)
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              statusFilter === tab.key
                ? 'bg-gold text-navy shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              statusFilter === tab.key ? 'bg-navy/10' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by order number, customer name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-all"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('orderNumber')}</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('customer')}</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">{t('date')}</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('status')}</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Method</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">{t('payment')}</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">{t('amount')}</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('actionsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-gold text-sm">{order.order_number}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-navy dark:text-white text-sm">{order.customer_name}</p>
                      <p className="text-xs text-gray-500 hidden sm:block">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 hidden md:table-cell">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    {getPaymentMethodBadge(order.payment_method)}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(order.payment_status || 'pending')}`}>
                      {order.payment_status || 'pending'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-navy dark:text-white hidden sm:table-cell">
                    C${Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title={t('viewDetails')}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      
                      {getActions(order).map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleStatusChange(order.id, action.status)}
                          disabled={updating}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${action.color}`}
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleSendInvoice(order)}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title={t('sendInvoice')}
                        >
                          📄
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">{t('noOrders')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('noOrdersSubtitle')}</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-navy dark:text-white">
                  {selectedOrder.order_number}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadge(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="capitalize">{selectedOrder.status}</span>
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentBadge(selectedOrder.payment_status || 'pending')}`}>
                  {t('payment')}: {selectedOrder.payment_status || 'pending'}
                </span>
              </div>

              {/* Payment Method */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-semibold text-navy dark:text-white mb-3">💳 {t('payment')}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                  {getPaymentMethodBadge(selectedOrder.payment_method)}
                </div>
                {selectedOrder.payment_method === 'paypal' && (
                  <p className="text-xs text-gray-500 mt-2">
                    Send PayPal payment to: <strong className="text-blue-600">manassekilembi@gmail.com</strong>
                  </p>
                )}
                {selectedOrder.payment_method !== 'paypal' && (
                  <p className="text-xs text-gray-500 mt-2">
                    Send Interac e-Transfer to: <strong className="text-gold">Mkvisionbusiness@gmail.com</strong>
                  </p>
                )}
              </div>

              {/* Customer Information */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-semibold text-navy dark:text-white mb-3">👤 {t('customerInfo')}</h3>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p className="text-sm">
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${selectedOrder.customer_email}`} className="text-gold hover:underline">
                      {selectedOrder.customer_email}
                    </a>
                  </p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm">
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${selectedOrder.customer_phone}`} className="text-gold hover:underline">
                        {selectedOrder.customer_phone}
                      </a>
                    </p>
                  )}
                  {selectedOrder.customer_address && (
                    <p className="text-sm"><strong>Address:</strong> {selectedOrder.customer_address}, {selectedOrder.customer_city}, {selectedOrder.customer_state} {selectedOrder.customer_zip}</p>
                  )}
                </div>
              </div>

              {/* Order Amount */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                <p className="text-sm text-gray-500 mb-1">{t('totalAmount')}</p>
                <p className="text-3xl font-bold text-gold">C${Number(selectedOrder.total || 0).toFixed(2)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t dark:border-gray-700">
                {getActions(selectedOrder).map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStatusChange(selectedOrder.id, action.status)}
                    disabled={updating}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${action.color}`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}

                {selectedOrder.status === 'confirmed' && (
                  <button
                    onClick={() => handleSendInvoice(selectedOrder)}
                    className="flex items-center space-x-2 px-5 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all"
                  >
                    <span>📄</span>
                    <span>{t('sendInvoice')}</span>
                  </button>
                )}

                <div className="flex gap-2 w-full pt-2 border-t dark:border-gray-700">
                  <a href={`mailto:${selectedOrder.customer_email}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <FiMail className="w-4 h-4" />
                    <span>{t('emailCustomer')}</span>
                  </a>
                  {selectedOrder.customer_phone && (
                    <a href={`tel:${selectedOrder.customer_phone}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <FiPhone className="w-4 h-4" />
                      <span>{t('callCustomer')}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}


import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiEdit2, FiSave, FiX, FiShoppingBag, FiHeart, FiClock, FiCheckCircle, FiTruck, FiLoader, FiDownload } from 'react-icons/fi'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { supabase } from '../../services/supabase'
import { downloadInvoice } from '../../services/invoiceService'
import toast from 'react-hot-toast'

export default function MyAccount() {
  const { customer, profile, signOut, updateProfile } = useCustomerAuth()
  const [orders, setOrders] = useState([])
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!customer) {
      navigate('/customer/login')
      return
    }
    loadOrders()
  }, [customer])

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', profile?.email || customer?.email)
      .order('created_at', { ascending: false })

    setOrders(data || [])
  }

  const handleUpdate = async () => {
    try {
      await updateProfile(formData)
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleDownloadInvoice = (order) => {
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
    toast.success('Invoice downloaded! 📄')
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FiClock className="w-4 h-4" />,
      confirmed: <FiCheckCircle className="w-4 h-4" />,
      processing: <FiLoader className="w-4 h-4 animate-spin" />,
      shipped: <FiTruck className="w-4 h-4" />,
      delivered: <FiPackage className="w-4 h-4" />,
      cancelled: <FiX className="w-4 h-4" />,
      declined: <FiX className="w-4 h-4" />,
    }
    return icons[status] || <FiClock className="w-4 h-4" />
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      processing: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      declined: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    return colors[status] || colors.pending
  }

  if (!customer) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-navy dark:via-navy dark:to-gray-900 py-8 md:py-12">
      <div className="container-custom max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-4xl font-bold text-navy">
              {profile?.full_name?.charAt(0)?.toUpperCase() || customer?.email?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-navy dark:text-white">
            Hello, {profile?.full_name || 'Beautiful'}! ✨
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{customer?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-1.5 flex space-x-1">
            {[
              { id: 'orders', icon: <FiPackage className="w-4 h-4" />, label: 'My Orders' },
              { id: 'profile', icon: <FiUser className="w-4 h-4" />, label: 'Profile' },
              { id: 'wishlist', icon: <FiHeart className="w-4 h-4" />, label: 'Wishlist' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gold text-navy shadow-md'
                    : 'text-gray-500 hover:text-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} 
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-bold text-navy dark:text-white">{order.order_number}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-2 border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <p className="text-2xl font-bold text-gold">${Number(order.total).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                        
                        {/* Payment Status */}
                        {order.payment_status && (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            order.payment_status === 'paid' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.payment_status}
                          </span>
                        )}

                        {/* Download Invoice Button */}
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors w-full justify-center"
                        >
                          <FiDownload className="w-3 h-3" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingBag className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-navy dark:text-white mb-2">No Orders Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Start shopping and your orders will appear here!</p>
                <Link to="/shop" 
                  className="inline-flex items-center space-x-2 bg-gold text-navy px-8 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all shadow-lg">
                  <span>🛍️</span>
                  <span>Start Shopping</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-navy dark:text-white">👤 Personal Information</h3>
                <button 
                  onClick={() => setEditing(!editing)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    editing 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                      : 'bg-gold/10 text-gold hover:bg-gold/20'
                  }`}
                >
                  {editing ? <><FiX className="w-4 h-4" /><span>Cancel</span></> : <><FiEdit2 className="w-4 h-4" /><span>Edit</span></>}
                </button>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input type="text" value={formData.full_name || ''} 
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input type="tel" value={formData.phone || ''} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <input type="text" value={formData.address || ''} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={formData.city || ''} placeholder="City"
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700" />
                    <input type="text" value={formData.state || ''} placeholder="State"
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700" />
                    <input type="text" value={formData.zip || ''} placeholder="ZIP"
                      onChange={(e) => setFormData({...formData, zip: e.target.value})}
                      className="px-4 py-3 border-2 rounded-xl bg-gray-50 dark:bg-gray-700" />
                  </div>
                  <button onClick={handleUpdate}
                    className="w-full flex items-center justify-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all shadow-lg">
                    <FiSave className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { icon: '👤', label: 'Name', value: profile?.full_name || 'Not set' },
                    { icon: '📧', label: 'Email', value: customer?.email || 'Not set' },
                    { icon: '📞', label: 'Phone', value: profile?.phone || 'Not set' },
                    { icon: '📍', label: 'Address', value: profile?.address || 'Not set' },
                    { icon: '🏙️', label: 'City', value: [profile?.city, profile?.state, profile?.zip].filter(Boolean).join(', ') || 'Not set' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-semibold text-navy dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleSignOut}
              className="w-full mt-4 flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-200 dark:border-red-800">
              <FiLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Your Wishlist</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Save your favorite items for later! ❤️</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </div>
        )}

      </div>
    </div>
  )
}


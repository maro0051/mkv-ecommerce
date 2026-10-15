import { useState, useEffect } from 'react'
import { FiLock, FiEye, FiEyeOff, FiSave, FiShield, FiMail, FiDollarSign, FiTruck, FiBell, FiGlobe } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('store')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingSave, setPendingSave] = useState(null)

  const [storeSettings, setStoreSettings] = useState({
    store_name: 'MK Vision Services',
    store_email: 'Mkvisionbusiness@gmail.com',
    store_phone: '+1 418 490 1884',
    store_address: '251 Windmill',
    store_city: 'Halifax',
    store_state: 'Nova Scotia',
    store_zip: 'B3A 4P2',
    store_country: 'Canada',
    currency: 'CAD',
    currency_symbol: 'C$',
    tax_rate: '15',
    free_shipping_min: '100',
    shipping_fee: '15',
    business_hours: 'Monday - Saturday: 9AM - 8PM',
    timezone: 'America/Halifax'
  })

  const [paymentSettings, setPaymentSettings] = useState({
    interac_email: 'Mkvisionbusiness@gmail.com',
    interac_name: 'MK Vision Services',
    accept_interac: true,
    accept_stripe: false,
    accept_paypal: false,
    stripe_public_key: '',
    stripe_secret_key: '',
    paypal_email: 'Mkvisionbusiness@gmail.com',
    payment_instructions: 'Send Interac e-Transfer with your order number as reference. Your order will be processed once payment is received.',
    require_payment_before_processing: true
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    admin_new_order_email: true,
    admin_new_order_sms: false,
    customer_order_confirmation: true,
    customer_order_status: true,
    customer_welcome_email: true,
    newsletter_notifications: true,
    contact_form_notifications: true,
    sms_phone_number: '',
    email_service: 'brevo',
    brevo_api_key: '',
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_phone_number: ''
  })

  const [shippingSettings, setShippingSettings] = useState({
    domestic_shipping: true,
    international_shipping: false,
    processing_time: '2-3 business days',
    delivery_time_domestic: '5-10 business days',
    delivery_time_international: '10-20 business days',
    free_shipping_enabled: true,
    free_shipping_minimum: '100',
    flat_rate_shipping: '15',
    international_shipping_fee: '30',
    allow_local_pickup: false,
    local_pickup_address: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [changingPassword, setChangingPassword] = useState(false)

  const [forgotEmail, setForgotEmail] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) {
        setLoading(false)
        return
      }

      if (data) {
        if (data.store_settings && Object.keys(data.store_settings).length > 0) {
          setStoreSettings(prev => ({ ...prev, ...data.store_settings }))
        }
        if (data.payment_settings && Object.keys(data.payment_settings).length > 0) {
          setPaymentSettings(prev => ({ ...prev, ...data.payment_settings }))
        }
        if (data.notification_settings && Object.keys(data.notification_settings).length > 0) {
          setNotificationSettings(prev => ({ ...prev, ...data.notification_settings }))
        }
        if (data.shipping_settings && Object.keys(data.shipping_settings).length > 0) {
          setShippingSettings(prev => ({ ...prev, ...data.shipping_settings }))
        }
      }
    } catch (error) {
      console.log('Settings load error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Request save (opens confirmation modal)
  const requestSave = (settingsType, data, label) => {
    setPendingSave({ settingsType, data, label })
    setShowConfirm(true)
  }

  // Confirm and save
  const confirmSave = async () => {
    if (!pendingSave) return

    setShowConfirm(false)
    setSaving(true)

    try {
      const { data: existing } = await supabase
        .from('store_settings')
        .select('id')
        .eq('id', 1)
        .single()

      let result

      if (existing) {
        result = await supabase
          .from('store_settings')
          .update({
            [pendingSave.settingsType]: pendingSave.data,
            updated_at: new Date().toISOString()
          })
          .eq('id', 1)
      } else {
        result = await supabase
          .from('store_settings')
          .insert({
            id: 1,
            [pendingSave.settingsType]: pendingSave.data,
            updated_at: new Date().toISOString()
          })
      }

      if (result.error) throw result.error

      toast.success(`${pendingSave.label} saved successfully!`, {
        duration: 4000,
        icon: '✅',
        style: {
          background: '#0F172A',
          color: '#D4AF37',
          fontWeight: '600',
          padding: '16px',
        },
      })

      setPendingSave(null)
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!passwordData.currentPassword) { toast.error('Enter current password'); return }
    if (passwordData.newPassword.length < 6) { toast.error('Password must be 6+ characters'); return }
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Passwords do not match'); return }

    setChangingPassword(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword
      })
      if (signInError) { toast.error('Current password is incorrect'); return }

      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword })
      if (error) throw error

      toast.success('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setChangingPassword(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) { toast.error('Enter your email'); return }

    setSendingReset(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: window.location.origin + '/#/admin/login'
      })
      if (error) throw error
      toast.success('Reset link sent! Check your email')
      setForgotEmail('')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSendingReset(false)
    }
  }

  const getSaveFunction = () => {
    switch (activeTab) {
      case 'store': return () => requestSave('store_settings', storeSettings, 'Store Settings')
      case 'payment': return () => requestSave('payment_settings', paymentSettings, 'Payment Settings')
      case 'notifications': return () => requestSave('notification_settings', notificationSettings, 'Notification Settings')
      case 'shipping': return () => requestSave('shipping_settings', shippingSettings, 'Shipping Settings')
      default: return () => {}
    }
  }

  const renderInput = (label, value, setter, key, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => setter(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm text-navy dark:text-white focus:outline-none focus:border-gold transition-all"
      />
    </div>
  )

  const renderToggle = (label, value, setter, key, description = '') => (
    <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div>
        <span className="text-sm font-semibold text-navy dark:text-white">{label}</span>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <input
        type="checkbox"
        checked={value || false}
        onChange={(e) => setter(prev => ({ ...prev, [key]: e.target.checked }))}
        className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
      />
    </label>
  )

  const tabs = [
    { id: 'store', icon: <FiGlobe className="w-4 h-4" />, label: 'Store' },
    { id: 'payment', icon: <FiDollarSign className="w-4 h-4" />, label: 'Payment' },
    { id: 'notifications', icon: <FiBell className="w-4 h-4" />, label: 'Notifications' },
    { id: 'shipping', icon: <FiTruck className="w-4 h-4" />, label: 'Shipping' },
    { id: 'password', icon: <FiLock className="w-4 h-4" />, label: 'Password' },
    { id: 'forgot', icon: <FiShield className="w-4 h-4" />, label: 'Reset' },
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
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your store configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-1.5 shadow-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-gold text-navy shadow-md' : 'text-gray-500 hover:text-navy dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-3xl">

        {/* STORE */}
        {activeTab === 'store' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
              <FiGlobe className="w-5 h-5 text-gold" /> <span>Store Information</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('Store Name', storeSettings.store_name, setStoreSettings, 'store_name')}
              {renderInput('Store Email', storeSettings.store_email, setStoreSettings, 'store_email', 'email')}
              {renderInput('Store Phone', storeSettings.store_phone, setStoreSettings, 'store_phone', 'tel')}
              {renderInput('Address', storeSettings.store_address, setStoreSettings, 'store_address')}
              {renderInput('City', storeSettings.store_city, setStoreSettings, 'store_city')}
              {renderInput('State', storeSettings.store_state, setStoreSettings, 'store_state')}
              {renderInput('ZIP Code', storeSettings.store_zip, setStoreSettings, 'store_zip')}
              {renderInput('Country', storeSettings.store_country, setStoreSettings, 'store_country')}
              {renderInput('Currency Code', storeSettings.currency, setStoreSettings, 'currency')}
              {renderInput('Currency Symbol', storeSettings.currency_symbol, setStoreSettings, 'currency_symbol')}
              {renderInput('Tax Rate (%)', storeSettings.tax_rate, setStoreSettings, 'tax_rate', 'number')}
              {renderInput('Free Shipping Min (C$)', storeSettings.free_shipping_min, setStoreSettings, 'free_shipping_min', 'number')}
              {renderInput('Shipping Fee (C$)', storeSettings.shipping_fee, setStoreSettings, 'shipping_fee', 'number')}
            </div>
            <div className="mt-4">
              {renderInput('Business Hours', storeSettings.business_hours, setStoreSettings, 'business_hours')}
            </div>
            <button
              onClick={getSaveFunction()}
              disabled={saving}
              className="mt-6 flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
            >
              <FiSave className="w-5 h-5" />
              <span>Save Store Settings</span>
            </button>
          </div>
        )}

        {/* PAYMENT */}
        {activeTab === 'payment' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
              <FiDollarSign className="w-5 h-5 text-gold" /> <span>Payment Settings</span>
            </h2>
            <div className="space-y-4">
              {renderToggle('Accept Interac e-Transfer', paymentSettings.accept_interac, setPaymentSettings, 'accept_interac')}
              {renderInput('Interac Email', paymentSettings.interac_email, setPaymentSettings, 'interac_email', 'email')}
              {renderInput('Interac Recipient Name', paymentSettings.interac_name, setPaymentSettings, 'interac_name')}
              {renderInput('PayPal Email', paymentSettings.paypal_email, setPaymentSettings, 'paypal_email', 'email')}
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Payment Instructions</label>
                <textarea
                  value={paymentSettings.payment_instructions}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, payment_instructions: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm text-navy dark:text-white focus:outline-none focus:border-gold transition-all resize-none"
                />
              </div>
            </div>
            <button
              onClick={getSaveFunction()}
              disabled={saving}
              className="mt-6 flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
            >
              <FiSave className="w-5 h-5" />
              <span>Save Payment Settings</span>
            </button>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
              <FiBell className="w-5 h-5 text-gold" /> <span>Notification Settings</span>
            </h2>
            <div className="space-y-4">
              {renderToggle('Enable Email Notifications', notificationSettings.email_notifications, setNotificationSettings, 'email_notifications')}
              {renderToggle('Admin: New Order Email', notificationSettings.admin_new_order_email, setNotificationSettings, 'admin_new_order_email')}
              {renderToggle('Customer: Order Confirmation', notificationSettings.customer_order_confirmation, setNotificationSettings, 'customer_order_confirmation')}
              {renderToggle('Customer: Order Status Updates', notificationSettings.customer_order_status, setNotificationSettings, 'customer_order_status')}
              {renderToggle('Customer: Welcome Email', notificationSettings.customer_welcome_email, setNotificationSettings, 'customer_welcome_email')}
              {renderToggle('Contact Form Notifications', notificationSettings.contact_form_notifications, setNotificationSettings, 'contact_form_notifications')}
              {renderInput('Brevo API Key', notificationSettings.brevo_api_key, setNotificationSettings, 'brevo_api_key', 'password')}
            </div>
            <button
              onClick={getSaveFunction()}
              disabled={saving}
              className="mt-6 flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
            >
              <FiSave className="w-5 h-5" />
              <span>Save Notification Settings</span>
            </button>
          </div>
        )}

        {/* SHIPPING */}
        {activeTab === 'shipping' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
              <FiTruck className="w-5 h-5 text-gold" /> <span>Shipping Settings</span>
            </h2>
            <div className="space-y-4">
              {renderToggle('Domestic Shipping', shippingSettings.domestic_shipping, setShippingSettings, 'domestic_shipping')}
              {renderToggle('International Shipping', shippingSettings.international_shipping, setShippingSettings, 'international_shipping')}
              {renderInput('Processing Time', shippingSettings.processing_time, setShippingSettings, 'processing_time')}
              {renderInput('Domestic Delivery', shippingSettings.delivery_time_domestic, setShippingSettings, 'delivery_time_domestic')}
              {renderInput('International Delivery', shippingSettings.delivery_time_international, setShippingSettings, 'delivery_time_international')}
              {renderToggle('Free Shipping', shippingSettings.free_shipping_enabled, setShippingSettings, 'free_shipping_enabled')}
              {renderInput('Free Shipping Minimum (C$)', shippingSettings.free_shipping_minimum, setShippingSettings, 'free_shipping_minimum', 'number')}
              {renderInput('Flat Rate Shipping (C$)', shippingSettings.flat_rate_shipping, setShippingSettings, 'flat_rate_shipping', 'number')}
              {renderInput('International Fee (C$)', shippingSettings.international_shipping_fee, setShippingSettings, 'international_shipping_fee', 'number')}
            </div>
            <button
              onClick={getSaveFunction()}
              disabled={saving}
              className="mt-6 flex items-center space-x-2 bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
            >
              <FiSave className="w-5 h-5" />
              <span>Save Shipping Settings</span>
            </button>
          </div>
        )}

        {/* PASSWORD */}
        {activeTab === 'password' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
              <FiLock className="w-5 h-5 text-gold" /> <span>Change Password</span>
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => {
                const key = field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'
                return (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-navy dark:text-white mb-2">
                      {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPasswords[key] ? 'text' : 'password'}
                        value={passwordData[field]}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, [field]: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white focus:outline-none focus:border-gold transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords[key] ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )
              })}
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full flex items-center justify-center space-x-2 bg-gold text-navy px-6 py-4 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
              >
                {changingPassword ? (
                  <><div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" /><span>Changing...</span></>
                ) : (
                  <><FiSave className="w-5 h-5" /><span>Change Password</span></>
                )}
              </button>
            </form>
          </div>
        )}

        {/* FORGOT */}
        {activeTab === 'forgot' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-navy dark:text-white mb-6 flex items-center space-x-2">
              <FiShield className="w-5 h-5 text-gold" /> <span>Reset Password</span>
            </h2>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy dark:text-white mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="your-email@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={sendingReset}
                className="w-full flex items-center justify-center space-x-2 bg-gold text-navy px-6 py-4 rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
              >
                {sendingReset ? (
                  <><div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" /><span>Sending...</span></>
                ) : (
                  <><FiMail className="w-5 h-5" /><span>Send Reset Link</span></>
                )}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowConfirm(false); setPendingSave(null) }} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSave className="w-8 h-8 text-gold" />
              </div>

              <h3 className="text-xl font-bold text-navy dark:text-white mb-2">
                Save Changes?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to save your {pendingSave?.label?.toLowerCase()}?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => { setShowConfirm(false); setPendingSave(null) }}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-navy dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gold text-navy rounded-xl font-semibold hover:bg-yellow-600 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Yes, Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}


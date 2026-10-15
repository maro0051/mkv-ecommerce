import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiGrid, FiMessageSquare, FiTrendingUp, FiPlus, FiUsers, FiDollarSign } from 'react-icons/fi'
import AdminLayout from '../../components/admin/AdminLayout'
import { getAllProducts, getContacts } from '../../services/adminService'
import { fetchCategories } from '../../services/supabase'
import { useAdminLanguage } from '../../context/AdminLanguageContext'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    messages: 0,
    featuredProducts: 0,
    totalValue: 0
  })
  const [recentMessages, setRecentMessages] = useState([])
  const { t } = useAdminLanguage()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [products, categories, contacts] = await Promise.all([
        getAllProducts(),
        fetchCategories(),
        getContacts()
      ])

      const featured = products.filter(p => p.featured).length
      const totalValue = products.reduce((sum, p) => sum + Number(p.price), 0)

      setStats({
        products: products.length,
        categories: categories.length,
        messages: contacts.length,
        featuredProducts: featured,
        totalValue: totalValue
      })

      setRecentMessages(contacts.slice(0, 5))
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const statCards = [
    { 
      label: t('totalProducts'), 
      value: stats.products, 
      icon: <FiPackage className="w-6 h-6" />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: '/admin/products'
    },
    { 
      label: t('totalCategories'), 
      value: stats.categories, 
      icon: <FiGrid className="w-6 h-6" />,
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      link: '/admin/categories'
    },
    { 
      label: t('featuredProducts'), 
      value: stats.featuredProducts, 
      icon: <FiTrendingUp className="w-6 h-6" />,
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      link: '/admin/products'
    },
    { 
      label: t('totalMessages'), 
      value: stats.messages, 
      icon: <FiMessageSquare className="w-6 h-6" />,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400',
      link: '/admin/messages'
    },
    { 
      label: t('inventoryValue'), 
      value: `C$${stats.totalValue.toLocaleString()}`, 
      icon: <FiDollarSign className="w-6 h-6" />,
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-800',
      iconColor: 'text-pink-600 dark:text-pink-400',
      link: '/admin/products'
    },
  ]

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy dark:text-white">
          {t('dashboardTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {t('dashboardSubtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, idx) => (
          <Link
            key={idx}
            to={stat.link}
            className={`group p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${stat.bg} ${stat.border}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 shadow-md mb-3 ${stat.iconColor}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-navy dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-navy dark:text-white mb-4">
            {t('quickActions')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/products/new"
              className="flex items-center space-x-2 p-4 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold font-semibold transition-all"
            >
              <FiPlus className="w-5 h-5" />
              <span className="text-sm">{t('addProduct')}</span>
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center space-x-2 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-navy dark:text-white font-semibold transition-all"
            >
              <FiPackage className="w-5 h-5" />
              <span className="text-sm">{t('viewProducts')}</span>
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center space-x-2 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-navy dark:text-white font-semibold transition-all"
            >
              <FiGrid className="w-5 h-5" />
              <span className="text-sm">{t('manageCategories')}</span>
            </Link>
            <Link
              to="/admin/messages"
              className="flex items-center space-x-2 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-navy dark:text-white font-semibold transition-all"
            >
              <FiMessageSquare className="w-5 h-5" />
              <span className="text-sm">{t('viewMessages')}</span>
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy dark:text-white">
              {t('recentMessages')}
            </h2>
            <Link to="/admin/messages" className="text-sm text-gold hover:underline">
              {t('viewAll')}
            </Link>
          </div>
          
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map(msg => (
                <div key={msg.id} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiUsers className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy dark:text-white">{msg.name}</p>
                    <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">{t('noMessages')}</p>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}


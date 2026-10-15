import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  FiHome, FiPackage, FiGrid, FiMessageSquare, FiLogOut, 
  FiMenu, FiX, FiChevronLeft, FiTrendingUp, FiShoppingCart,
  FiUser, FiSettings, FiSun, FiMoon, FiTag, FiStar
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useAdminLanguage } from '../../context/AdminLanguageContext'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const { language, setLang, t } = useAdminLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const menuItems = [
    { icon: <FiHome className="w-5 h-5" />, label: t('dashboard'), path: '/admin/dashboard' },
    { icon: <FiShoppingCart className="w-5 h-5" />, label: t('orders'), path: '/admin/orders' },
    { icon: <FiPackage className="w-5 h-5" />, label: t('products'), path: '/admin/products' },
    { icon: <FiGrid className="w-5 h-5" />, label: t('categories'), path: '/admin/categories' },
    { icon: <FiStar className="w-5 h-5" />, label: t('reviews'), path: '/admin/reviews' },
    { icon: <FiTag className="w-5 h-5" />, label: t('discounts'), path: '/admin/discounts' },
    { icon: <FiTrendingUp className="w-5 h-5" />, label: t('analytics'), path: '/admin/analytics' },
    { icon: <FiMessageSquare className="w-5 h-5" />, label: t('messages'), path: '/admin/messages' },
    { icon: <FiSettings className="w-5 h-5" />, label: t('settings'), path: '/admin/settings' },
  ]

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        <div className="flex flex-col h-full">
          
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 bg-gold rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <span className="text-xl font-bold text-navy">M</span>
              </div>
              <div>
                <span className="text-lg font-serif font-bold text-navy dark:text-white">M.K.V</span>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                  {t('adminPanel')}
                </p>
              </div>
            </Link>
          </div>

          {/* Language + Theme Toggles */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            {/* Language Toggle */}
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  language === 'en' 
                    ? 'bg-gold text-navy shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
              <button 
                onClick={() => setLang('fr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  language === 'fr' 
                    ? 'bg-gold text-navy shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Français"
              >
                🇫🇷 FR
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">
              {t('mainMenu')}
            </p>
            
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive(item.path)
                    ? 'bg-gold/10 text-gold shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-navy dark:hover:text-white'
                }`}
              >
                <span className={isActive(item.path) ? 'text-gold' : 'text-gray-400 group-hover:text-navy dark:group-hover:text-white'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-1.5 bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* User & Sign Out */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                <FiUser className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">
                  {user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {t('administrator')}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium"
            >
              <FiLogOut className="w-4 h-4" />
              <span>{t('signOut')}</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>

              <div className="hidden sm:block">
                <p className="text-sm font-medium text-navy dark:text-white">
                  {menuItems.find(item => isActive(item.path))?.label || t('dashboard')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Mobile Language Toggle */}
              <div className="flex items-center space-x-1 lg:hidden">
                <button 
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    language === 'en' ? 'bg-gold text-navy' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('fr')}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    language === 'fr' ? 'bg-gold text-navy' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  FR
                </button>
              </div>

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              <Link 
                to="/"
                target="_blank"
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span>{t('viewStore')}</span>
              </Link>

              <Link
                to="/admin/products/new"
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gold text-navy rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-all"
              >
                <FiPackage className="w-4 h-4" />
                <span>{t('addProduct')}</span>
              </Link>
            </div>

          </div>
        </header>

        <main className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>

      </div>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiSun, FiMoon, FiMenu, FiX, FiSearch, FiUser } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import SearchModal from './SearchModal'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentLang, setCurrentLang] = useState('en')
  const { darkMode, toggleDarkMode } = useTheme()
  const { customer, isAdminUser } = useCustomerAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem('mkv-cart')
        if (savedCart) {
          const cart = JSON.parse(savedCart)
          setCartCount(cart.reduce((t, i) => t + i.quantity, 0))
        } else setCartCount(0)
      } catch (e) { setCartCount(0) }
    }
    updateCartCount()
    window.addEventListener('cartUpdated', updateCartCount)
    return () => window.removeEventListener('cartUpdated', updateCartCount)
  }, [])

  // Check for French cookie on load
  useEffect(() => {
    const cookie = document.cookie.match(/googtrans=\/en\/fr/)
    if (cookie) {
      setCurrentLang('fr')
    }
  }, [])

  // SIMPLE SWITCH - RELOADS PAGE (ALWAYS WORKS)
  const switchLanguage = (lang) => {
    if (lang === 'en') {
      // Clear all Google Translate cookies
      document.cookie = 'googtrans=; path=/; max-age=0'
      document.cookie = 'googtrans=; path=/; domain=.' + window.location.hostname + '; max-age=0'
      localStorage.removeItem('mkv-language')
    } else {
      // Set French cookie
      document.cookie = 'googtrans=/en/fr; path=/; SameSite=Lax; max-age=86400'
      document.cookie = 'googtrans=/en/fr; path=/; domain=.' + window.location.hostname + '; SameSite=Lax; max-age=86400'
      localStorage.setItem('mkv-language', 'fr')
    }
    
    // Reload to apply
    window.location.reload()
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const getAccountLink = () => {
    if (customer && !isAdminUser) return '/my-account'
    return '/customer/login'
  }

  const isCustomerLoggedIn = customer && !isAdminUser

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-navy/95 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-navy'
      }`}>
        <div className="bg-gold text-navy text-xs md:text-sm py-2 font-medium">
          <div className="container-custom text-center">
            <p className="truncate px-4">✦ Free Shipping on Orders Over $100 &nbsp;|&nbsp; Easy 30-Day Returns ✦</p>
          </div>
        </div>

        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-navy dark:bg-gold rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-all">
                <span className="text-xl md:text-2xl font-bold text-gold dark:text-navy">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl md:text-2xl font-serif font-bold text-navy dark:text-white leading-none">M.K.V</span>
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 tracking-[0.15em]">LUXURY COLLECTION</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path ? 'text-gold bg-gold/10' : 'text-gray-700 dark:text-gray-200 hover:text-gold hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>{link.name}</Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-1">
              
              {/* Language Toggle - RELOADS PAGE */}
              <div className="flex items-center space-x-0.5 mr-2 border-r border-gray-200 dark:border-gray-700 pr-2">
                <button onClick={() => switchLanguage('en')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentLang === 'en' ? 'bg-gold text-navy shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                  🇬🇧 EN
                </button>
                <button onClick={() => switchLanguage('fr')}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentLang === 'fr' ? 'bg-gold text-navy shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                  🇫🇷 FR
                </button>
              </div>

              <button onClick={() => setSearchModalOpen(true)} className="p-2.5 text-gray-700 dark:text-gray-200 hover:text-gold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title="Search">
                <FiSearch className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-700 dark:text-gray-200 hover:text-gold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title="Wishlist">
                <FiHeart className="w-5 h-5" />
              </button>
              <Link to={getAccountLink()} className="p-2.5 text-gray-700 dark:text-gray-200 hover:text-gold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all relative" title={isCustomerLoggedIn ? 'My Account' : 'Sign In'}>
                <FiUser className="w-5 h-5" />
                {isCustomerLoggedIn && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-navy" />}
              </Link>
              <Link to="/cart" className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:text-gold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title="Cart">
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">{cartCount}</span>}
              </Link>
              <button onClick={toggleDarkMode} className="p-2.5 text-gray-700 dark:text-gray-200 hover:text-gold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title={darkMode ? 'Light' : 'Dark'}>
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2.5 text-navy dark:text-white hover:text-gold rounded-lg transition-colors">
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-navy border-t border-gray-100 dark:border-gray-700 shadow-2xl">
            <div className="container-custom py-6 space-y-1">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${location.pathname === link.path ? 'text-gold bg-gold/10' : 'text-gray-700 dark:text-gray-200'}`}>{link.name}</Link>
              ))}
              <div className="border-t my-4" />
              <div className="flex items-center space-x-2 px-2 mb-4">
                <span className="text-sm text-gray-500">Language:</span>
                <button onClick={() => switchLanguage('en')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentLang === 'en' ? 'bg-gold text-navy' : 'bg-gray-100 dark:bg-gray-800'}`}>🇬🇧 EN</button>
                <button onClick={() => switchLanguage('fr')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentLang === 'fr' ? 'bg-gold text-navy' : 'bg-gray-100 dark:bg-gray-800'}`}>🇫🇷 FR</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to={getAccountLink()} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-navy dark:text-white font-medium text-sm">
                  <FiUser className="w-5 h-5" /><span>{isCustomerLoggedIn ? 'My Account' : 'Sign In'}</span>
                </Link>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-navy dark:text-white font-medium text-sm">
                  <FiShoppingCart className="w-5 h-5" /><span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-navy dark:text-white font-medium text-sm">
                  <FiHeart className="w-5 h-5" /><span>Wishlist</span>
                </button>
                <button onClick={toggleDarkMode} className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-navy dark:text-white font-medium text-sm">
                  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}<span>{darkMode ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  )
}


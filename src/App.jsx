import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AdminRoute from './components/admin/AdminRoute'
import CheckoutGuard from './components/CheckoutGuard'
import { CustomerAuthProvider } from './context/CustomerAuthContext'

import CustomerAutoLogout from './components/CustomerAutoLogout'
import AdminAutoLogout from './components/AdminAutoLogout'
import SessionTimer from './components/SessionTimer'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import CashCheckout from './pages/CashCheckout'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'

// Customer Pages
import CustomerLogin from './pages/customer/CustomerLogin'
import MyAccount from './pages/customer/MyAccount'


// Checkout Pages
import CheckoutLayout from './pages/checkout/CheckoutLayout'
import CheckoutEntry from './pages/checkout/CheckoutEntry'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'
import AdminMessages from './pages/admin/AdminMessages'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminOrders from './pages/admin/AdminOrders'
import AdminReviews from './pages/admin/AdminReviews'
import AdminSettings from './pages/admin/AdminSettings'


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy transition-colors duration-300">
      <CustomerAuthProvider>
        
        {/* Security Auto-Logout */}
        <CustomerAutoLogout />
        <AdminAutoLogout />
        
        <Routes>
          {/* ===== ADMIN ROUTES ===== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
          <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

          {/* ===== CHECKOUT ROUTES ===== */}
          <Route path="/interac-checkout" element={<CashCheckout />} />
          <Route path="/cash-checkout" element={<CashCheckout />} />
          <Route path="/checkout" element={<CheckoutEntry />} />
          <Route path="/checkout/shipping" element={<CheckoutGuard><CheckoutLayout /></CheckoutGuard>} />

          {/* ===== CUSTOMER ROUTES ===== */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/my-account" element={<MyAccount />} />

          {/* ===== LEGAL PAGES ===== */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* ===== PUBLIC ROUTES (MUST BE LAST) ===== */}
          <Route path="*" element={<PublicLayout />} />
        </Routes>

        {/* Global Components */}
        <SessionTimer />
        
        
      </CustomerAuthProvider>
    </div>
  )
}

// Public Layout Component
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 md:pt-36">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F172A',
            color: '#D4AF37',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      />
    </>
  )
}

export default App


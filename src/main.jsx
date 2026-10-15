import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import { CartProvider } from './context/CartContext'
import { AdminLanguageProvider } from './context/AdminLanguageContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <CustomerAuthProvider>
            <CartProvider>
              <AdminLanguageProvider>
                <App />
              </AdminLanguageProvider>
            </CartProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
)


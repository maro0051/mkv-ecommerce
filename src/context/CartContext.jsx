import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('mkv-cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mkv-cart', JSON.stringify(cart))
    // Dispatch custom event for navbar cart count
    window.dispatchEvent(new Event('cartUpdated'))
  }, [cart])

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      
      if (existingItem) {
        toast.success('Updated cart quantity')
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      toast.success(`${product.name} added to cart`, { icon: '🛍️' })
      return [...prevCart, { ...product, quantity }]
    })
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
    toast.success('Item removed from cart')
  }

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  // Update cart item (variant change, price update, etc.)
  const updateCartItem = (productId, updatedFields) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, ...updatedFields } : item
      )
    )
    toast.success('Item updated!')
  }

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + (Number(item.price) * item.quantity), 
    0
  )

  // Calculate total items
  const cartCount = cart.reduce(
    (count, item) => count + item.quantity, 
    0
  )

  // Clear entire cart
  const clearCart = () => {
    setCart([])
    toast.success('Cart cleared')
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCartItem,
      cartTotal,
      cartCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}


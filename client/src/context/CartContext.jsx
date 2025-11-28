import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product, user) => {
    if (!user) {
      alert('Please login to add items to cart')
      return false
    }
    const existingItem = cart.find(item => item._id === product._id)
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    return true
  }, [cart])

  const removeFromCart = useCallback((productId) => {
    setCart(cart.filter(item => item._id !== productId))
  }, [cart])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item => 
        item._id === productId 
          ? { ...item, quantity }
          : item
      ))
    }
  }, [cart, removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cart])

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
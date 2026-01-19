'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem, Product, ShoppingCart } from '@/lib/types/product'
import { calculateSustainabilityScore } from '@/lib/utils'

interface CartContextType {
  cart: ShoppingCart | null
  items: CartItem[]
  itemCount: number
  totalPrice: number
  totalCarbonFootprint: number
  potentialEcoCredits: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'ecoswap-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShoppingCart | null>(null)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Convert date strings back to Date objects
        parsedCart.items = parsedCart.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
          product: {
            ...item.product,
            createdAt: new Date(item.product.createdAt),
            updatedAt: new Date(item.product.updatedAt),
          }
        }))
        parsedCart.createdAt = new Date(parsedCart.createdAt)
        parsedCart.updatedAt = new Date(parsedCart.updatedAt)
        setCart(parsedCart)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        initializeEmptyCart()
      }
    } else {
      initializeEmptyCart()
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart])

  const initializeEmptyCart = () => {
    const newCart: ShoppingCart = {
      id: `cart-${Date.now()}`,
      userId: 'guest', // Will be updated when user logs in
      items: [],
      totalPrice: 0,
      totalCarbonFootprint: 0,
      potentialEcoCredits: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setCart(newCart)
  }

  const calculateCartTotals = (items: CartItem[]) => {
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const totalCarbonFootprint = items.reduce((sum, item) => sum + (item.product.carbonIntensity * item.quantity), 0)
    
    // Calculate potential eco credits based on sustainability choices
    const potentialEcoCredits = items.reduce((sum, item) => {
      const baseCredits = Math.floor(item.product.sustainabilityScore / 10) * item.quantity
      const organicBonus = item.product.isOrganic ? 5 * item.quantity : 0
      const swapBonus = item.isSustainableSwap ? 10 * item.quantity : 0
      return sum + baseCredits + organicBonus + swapBonus
    }, 0)

    return { totalPrice, totalCarbonFootprint, potentialEcoCredits }
  }

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!cart) return

    setCart(prevCart => {
      if (!prevCart) return prevCart

      const existingItemIndex = prevCart.items.findIndex(item => item.product.id === product.id)
      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...prevCart.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        }
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          addedAt: new Date(),
          isSustainableSwap: false,
        }
        newItems = [...prevCart.items, newItem]
      }

      const totals = calculateCartTotals(newItems)

      return {
        ...prevCart,
        items: newItems,
        ...totals,
        updatedAt: new Date(),
      }
    })
  }

  const removeFromCart = (productId: string) => {
    if (!cart) return

    setCart(prevCart => {
      if (!prevCart) return prevCart

      const newItems = prevCart.items.filter(item => item.product.id !== productId)
      const totals = calculateCartTotals(newItems)

      return {
        ...prevCart,
        items: newItems,
        ...totals,
        updatedAt: new Date(),
      }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (!cart) return

    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(prevCart => {
      if (!prevCart) return prevCart

      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )

      const totals = calculateCartTotals(newItems)

      return {
        ...prevCart,
        items: newItems,
        ...totals,
        updatedAt: new Date(),
      }
    })
  }

  const clearCart = () => {
    if (!cart) return

    setCart(prevCart => {
      if (!prevCart) return prevCart

      return {
        ...prevCart,
        items: [],
        totalPrice: 0,
        totalCarbonFootprint: 0,
        potentialEcoCredits: 0,
        updatedAt: new Date(),
      }
    })
  }

  const isInCart = (productId: string): boolean => {
    return cart?.items.some(item => item.product.id === productId) || false
  }

  const getItemQuantity = (productId: string): number => {
    const item = cart?.items.find(item => item.product.id === productId)
    return item?.quantity || 0
  }

  const value = {
    cart,
    items: cart?.items || [],
    itemCount: cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    totalPrice: cart?.totalPrice || 0,
    totalCarbonFootprint: cart?.totalCarbonFootprint || 0,
    potentialEcoCredits: cart?.potentialEcoCredits || 0,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
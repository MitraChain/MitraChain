import { Product } from '@workspace/supabase/index'
import { useMemo } from 'react'
import { create } from 'zustand'

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: Map<string, CartItem>
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: new Map(),

  addToCart: (product) =>
    set((state) => {
      const newItems = new Map(state.items)
      const existingItem = newItems.get(product.id)
      if (existingItem) {
        newItems.set(product.id, { ...existingItem, quantity: existingItem.quantity + 1 })
      } else {
        newItems.set(product.id, { ...product, quantity: 1 })
      }
      return { items: newItems }
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newItems = new Map(state.items)
      const existingItem = newItems.get(productId)
      if (!existingItem) return state

      if (existingItem.quantity > 1) {
        newItems.set(productId, { ...existingItem, quantity: existingItem.quantity - 1 })
      } else {
        newItems.delete(productId)
      }
      return { items: newItems }
    }),

  clearCart: () => set({ items: new Map() }),
}))

export const useCartItems = () => {
  const items = useCartStore((state) => state.items)

  return useMemo(() => Array.from(items.values()), [items])
}

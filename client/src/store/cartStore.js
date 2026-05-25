import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (product) =>
        set((state) => {
          const cartKey = `${product.id}-${product.selectedOption?.name || 'default'}`;
          const existing = state.items.find((i) => i.cartKey === cartKey);
          
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i
              ),
              isCartOpen: true,
            };
          }
          return { items: [...state.items, { ...product, cartKey, qty: 1 }], isCartOpen: true };
        }),

      removeItem: (cartKey) =>
        set((state) => ({ items: state.items.filter((i) => i.cartKey !== cartKey) })),

      updateQty: (cartKey, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.cartKey !== cartKey)
              : state.items.map((i) => (i.cartKey === cartKey ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { 
      name: 'mw-cart', 
      partialize: (state) => ({ items: state.items }) // ONLY persist items, not UI state
    }
  )
);

export default useCartStore;

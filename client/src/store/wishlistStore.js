import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === product.id);
          return exists
            ? { items: state.items.filter((i) => i.id !== product.id) }
            : { items: [...state.items, product] };
        }),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      isSaved: (id) => !!get().items.find((i) => i.id === id),
    }),
    { name: 'mw-wishlist' }
  )
);

export default useWishlistStore;

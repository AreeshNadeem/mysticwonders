import { useState, useEffect } from 'react';
import api from '../lib/api';
import { PRODUCTS } from '../lib/constants';

/**
 * Fetches products from the API.
 * Falls back to local PRODUCTS constant if the API is unreachable
 * (useful during frontend-only development).
 */
export function useProducts(category = '') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = category && category !== 'All' ? { category: category.toLowerCase() } : {};
        const { data } = await api.get('/products', { params });
        if (!cancelled) setProducts(data);
      } catch {
        // Fallback to local data in dev
        if (!cancelled) {
          const filtered =
            !category || category === 'All'
              ? PRODUCTS
              : category === 'New in ✦'
              ? PRODUCTS.filter((p) => p.badge === 'New' || p.badge === 'Bestseller')
              : PRODUCTS.filter((p) => p.category === category.toLowerCase());
          setProducts(filtered);
          setError(null); // suppress error in dev fallback
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, [category]);

  return { products, loading, error };
}

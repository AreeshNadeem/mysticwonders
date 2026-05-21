import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PRODUCTS } from '../lib/constants'; // Fallback if database is empty

export function useProducts(category = '') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsCol = collection(db, 'products');
        const snap = await getDocs(productsCol);
        
        let fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (fetched.length === 0) {
          // Fallback to local data if database is totally empty 
          // (helps prevent blank screens before user seeds data)
          fetched = PRODUCTS;
        }

        if (!category || category === 'All') {
          // nothing to filter
        } else if (category === 'New in ✦') {
          fetched = fetched.filter(p => p.badge === 'New' || p.badge === 'Bestseller');
        } else {
          fetched = fetched.filter(p => p.category === category.toLowerCase());
        }

        if (!cancelled) {
          setProducts(fetched);
          setError(null);
        }
      } catch (err) {
        console.error("Firebase fetch error:", err);
        if (!cancelled) {
          setError(err.message);
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

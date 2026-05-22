import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { T, CATS } from '../lib/constants';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';
import Navbar from '../components/layout/Navbar';
import useCartStore from '../store/cartStore';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'bestselling', label: 'Bestselling' },
];

export default function Shop() {
  const navigate   = useNavigate();
  const [activeCat, setActiveCat] = useState('All');
  const [sortType, setSortType] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { products: fetchedProducts, loading } = useProducts(activeCat);

  const sortedProducts = useMemo(() => {
    if (!fetchedProducts) return [];
    let items = [...fetchedProducts];
    
    switch (sortType) {
      case 'newest':
        items.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        items.sort((a, b) => a.id - b.id);
        break;
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        items.sort((a, b) => {
          const aBest = a.badge === 'Bestseller' ? 1 : 0;
          const bBest = b.badge === 'Bestseller' ? 1 : 0;
          return bBest - aBest;
        });
        break;
      default:
        break;
    }
    return items;
  }, [fetchedProducts, sortType]);

  return (
    <div className="scroll-area" style={{ background: T.cream }}>
      <Navbar />

      {/* Category chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '16px clamp(16px, 4vw, 48px)',
        overflowX: 'auto', scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        background: T.blushBg, borderBottom: '0.5px solid #EDD0D6',
        position: 'sticky', top: 0, zIndex: 90
      }}>
        {CATS.map((c) => (
          <div key={c} className={`cat-chip${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>{c}</div>
        ))}
      </div>

      {/* Header row */}
      <div style={{ padding: '32px clamp(16px, 4vw, 48px) 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1400, margin: '0 auto', width: '100%', position: 'relative', zIndex: 95 }}>
        <div className="playfair" style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontStyle: 'italic', color: T.burgundyDeep }}>
          {activeCat === 'All' ? 'All pieces' : activeCat}
        </div>
        
        {/* Sort Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            style={{ background: '#fff', border: '0.5px solid #E0B0BA', color: T.burgundyDeep, borderRadius: 20, padding: '6px 16px', fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(107, 26, 46, 0.04)' }}
          >
            {SORT_OPTIONS.find(o => o.id === sortType).label}
            <span style={{ fontSize: 10, opacity: 0.6 }}>{isSortOpen ? '▲' : '▼'}</span>
          </button>
          
          <AnimatePresence>
            {isSortOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute', top: '120%', right: 0, background: '#fff', borderRadius: 16, border: '0.5px solid #EDD0D6', boxShadow: '0 10px 30px rgba(107, 26, 46, 0.1)', padding: 8, minWidth: 180 }}
              >
                {SORT_OPTIONS.map(opt => (
                  <div 
                    key={opt.id} 
                    onClick={() => { setSortType(opt.id); setIsSortOpen(false); }}
                    style={{ padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'EB Garamond, serif', fontSize: 14, color: sortType === opt.id ? T.burgundy : T.textMuted, background: sortType === opt.id ? '#FFF7F8' : 'transparent', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { if (sortType !== opt.id) e.target.style.background = '#FDF0F3'; }}
                    onMouseOut={(e) => { if (sortType !== opt.id) e.target.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="product-grid" style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '32px clamp(16px, 4vw, 48px)' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 24, overflow: 'hidden', background: '#fff', border: '0.5px solid #EDD0D6' }}>
              <div style={{ aspectRatio: '1', background: 'linear-gradient(90deg, #FDF0F3 25%, #EDD0D6 50%, #FDF0F3 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.4s infinite' }} />
              <div style={{ padding: '16px 20px', display: 'grid', gap: 10 }}>
                <div style={{ height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #FDF0F3 25%, #EDD0D6 50%, #FDF0F3 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.4s infinite', width: '70%' }} />
                <div style={{ height: 14, borderRadius: 8, background: 'linear-gradient(90deg, #FDF0F3 25%, #EDD0D6 50%, #FDF0F3 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.4s infinite', width: '40%' }} />
                <div style={{ height: 36, borderRadius: 20, marginTop: 8, background: 'linear-gradient(90deg, #FDF0F3 25%, #EDD0D6 50%, #FDF0F3 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.4s infinite' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', minHeight: '40vh' }}>
          {sortedProducts.length > 0 ? (
            <motion.div
              className="product-grid"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {sortedProducts.map((p) => (
                <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '120px 0', fontFamily: 'EB Garamond, serif', color: T.textMuted, fontStyle: 'italic', fontSize: 18 }}>no pieces found in this category ✦</div>
          )}
        </div>
      )}

    </div>
  );
}

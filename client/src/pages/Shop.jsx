import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { T, CATS } from '../lib/constants';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';
import Navbar from '../components/layout/Navbar';
import useCartStore from '../store/cartStore';

export default function Shop() {
  const navigate   = useNavigate();
  const [activeCat, setActiveCat] = useState('All');
  const { products, loading } = useProducts(activeCat);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <div className="scroll-area" style={{ background: T.cream }}>
      <Navbar />

      {/* Category chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px clamp(16px, 4vw, 48px)',
        overflowX: 'auto', scrollbarWidth: 'none',
        background: T.blushBg, borderBottom: '0.5px solid #EDD0D6',
      }}>
        {CATS.map((c) => (
          <div key={c} className={`cat-chip${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>{c}</div>
        ))}
      </div>

      {/* Header row */}
      <div style={{ padding: '40px clamp(16px, 4vw, 48px) 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1400, margin: '0 auto', width: '100%' }}>

        <div className="playfair" style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontStyle: 'italic', color: T.burgundyDeep }}>
          {activeCat === 'All' ? 'All pieces' : activeCat}
        </div>
        <button style={{ background: 'transparent', border: '0.5px solid #E0B0BA', color: T.textAccent, borderRadius: 20, padding: '5px 14px', fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.04em', cursor: 'pointer' }}>
          Newest ↓
        </button>
      </div>

      {/* Product grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'EB Garamond, serif', color: T.textMuted, fontStyle: 'italic' }}>loading wonders…</div>
      ) : (
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 20px' }}>
          <motion.div
            className="product-grid"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

    </div>
  );
}

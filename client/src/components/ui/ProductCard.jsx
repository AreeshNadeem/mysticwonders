import { useNavigate } from 'react-router-dom';
import useCartStore    from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import { T } from '../../lib/constants';
import { motion } from 'framer-motion';

export default function ProductCard({ product: p, animDelay = 0 }) {
  const navigate = useNavigate();
  const addItem  = useCartStore((s) => s.addItem);
  const toggle   = useWishlistStore((s) => s.toggle);
  const isSaved  = useWishlistStore((s) => s.isSaved(p.id));

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!p.soldOut) addItem(p);
  };

  return (
    <div
      className="product-card"
      style={{ animationDelay: `${animDelay}s` }}
      onClick={() => navigate(`/shop/${p.id}`)}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: '100%',
          aspectRatio: 1,
          background: p.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          position: 'relative',
        }}
      >
        {p.emoji}

        {/* Badge */}
        {p.badge && (
          <div className={`badge${p.soldOut ? ' badge-sold' : ''}`}>{p.badge}</div>
        )}

        {/* Wishlist heart */}
        <motion.div
          className={`wishlist-btn-card${isSaved ? ' saved' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggle(p); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSaved ? '♥' : '♡'}
        </motion.div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 12px 14px' }}>
        <div className="playfair" style={{ fontStyle: 'italic', fontSize: 14, color: T.burgundyDeep, marginBottom: 3, lineHeight: 1.3 }}>
          {p.name}
        </div>
        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, color: T.textMuted, marginBottom: 7 }}>
          {p.sub}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="playfair" style={{ fontSize: 15, color: T.burgundy }}>Rs {p.price}</span>
          {!p.soldOut && (
            <motion.button
              style={{ background: T.burgundy, color: T.blushLight, border: 'none', borderRadius: 20, padding: '4px 10px', fontFamily: 'EB Garamond, serif', fontSize: 13, cursor: 'pointer' }}
              onClick={handleAdd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

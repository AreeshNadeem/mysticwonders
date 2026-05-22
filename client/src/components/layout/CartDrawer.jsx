import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { T } from '../../lib/constants';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, isCartOpen, closeCart, updateQty, removeItem, subtotal } = useCartStore();

  const total = subtotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(18, 4, 8, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 2000,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: 380,
              background: '#fff',
              zIndex: 2001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(107, 26, 46, 0.05)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: `0.5px solid ${T.blushBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="playfair" style={{ fontSize: 24, fontStyle: 'italic', color: T.burgundyDeep }}>Your Bag</span>
                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textMuted, marginTop: 4 }}>({items.length})</span>
              </div>
              <button 
                onClick={closeCart} 
                style={{ background: 'none', border: 'none', fontSize: 28, color: T.textMuted, cursor: 'pointer', padding: 4 }}
              >
                ×
              </button>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
              {items.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>✦</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, fontStyle: 'italic' }}>Your bag is currently empty</div>
                  <button 
                    onClick={closeCart}
                    style={{ marginTop: 24, background: 'none', border: `0.5px solid ${T.burgundy}`, color: T.burgundy, padding: '10px 24px', borderRadius: 40, fontFamily: 'EB Garamond, serif', fontSize: 14, cursor: 'pointer' }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 24 }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: 16 }}>
                      {/* Item Image Placeholder */}
                      <div style={{ width: 80, height: 80, borderRadius: 12, background: item.bg || '#FDEEF2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                        ✦
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                          <div className="playfair" style={{ fontSize: 17, fontStyle: 'italic', color: T.burgundyDeep }}>{item.name}</div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            style={{ background: 'none', border: 'none', color: '#C47080', cursor: 'pointer', padding: 2, fontSize: 16 }}
                          >
                            ×
                          </button>
                        </div>
                        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textMuted, marginBottom: 12 }}>{item.sub}</div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #EDD0D6', borderRadius: 20, padding: '4px 8px', gap: 12 }}>
                            <button 
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              style={{ background: 'none', border: 'none', color: T.burgundy, fontSize: 18, cursor: 'pointer', padding: '0 4px' }}
                            >
                              −
                            </button>
                            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.burgundyDeep, minWidth: 12, textAlign: 'center' }}>{item.qty}</span>
                            <button 
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              style={{ background: 'none', border: 'none', color: T.burgundy, fontSize: 18, cursor: 'pointer', padding: '0 4px' }}
                            >
                              +
                            </button>
                          </div>
                          <div className="playfair" style={{ fontSize: 17, color: T.burgundy }}>Rs {item.price * item.qty}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '24px', borderTop: `0.5px solid ${T.blushBorder}`, background: '#FFF7F8' }}>
                <div style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textMuted, fontStyle: 'italic' }}>
                  shipping calculated at checkout ✦
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textAccent }}>Subtotal</span>
                  <span className="playfair" style={{ fontSize: 22, color: T.burgundyDeep }}>Rs {total}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button 
                    onClick={() => { closeCart(); navigate('/cart'); }}
                    className="btn-primary"
                    style={{ padding: '16px', borderRadius: 40, width: '100%', fontSize: 15 }}
                  >
                    View Bag & Checkout ✦
                  </button>
                  <button 
                    onClick={closeCart}
                    style={{ background: 'transparent', border: 'none', color: T.textMuted, fontFamily: 'EB Garamond, serif', fontSize: 14, cursor: 'pointer', padding: 8, fontStyle: 'italic' }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

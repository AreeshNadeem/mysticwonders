import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, PRODUCTS } from '../lib/constants';
import Navbar from '../components/layout/Navbar';
import useCartStore    from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

export default function Wishlist() {
  const navigate  = useNavigate();
  const [removing, setRemoving] = useState(null);

  const items    = useWishlistStore((s) => s.items);
  const remove   = useWishlistStore((s) => s.remove);
  const addItem  = useCartStore((s) => s.addItem);

  const SUGGESTIONS = PRODUCTS.filter((p) => !items.find((w) => w.id === p.id)).slice(0, 4);

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => {
      remove(id);
      setRemoving(null);
    }, 300);
  };

  const addAllToBag = () => {
    items.filter((p) => !p.soldOut).forEach((p) => addItem(p));
    navigate('/checkout');
  };

  return (
    <div className="scroll-area" style={{ background: T.cream }}>
      <Navbar />

      <div className="content-wrap" style={{ padding: '80px 20px 100px', maxWidth: 1400 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 12 }}>✦ &nbsp; Saved pieces</div>
          <h1 className="playfair" style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 12 }}>Your wishlist</h1>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, fontStyle: 'italic' }}>
            {items.length} piece{items.length !== 1 ? 's' : ''} saved{items.some((p) => p.stock && p.stock <= 3) ? ' · selling fast' : ''}
          </p>
        </div>

        <div className="divider" style={{ marginBottom: 60 }}><div className="divider-line"/><span className="divider-star">✦</span><div className="divider-line"/></div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
          
          {/* Main List */}
          <div style={{ gridColumn: items.length > 0 ? 'span 2' : 'span 1' }}>
            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0', background: '#FDF0F3', borderRadius: 24, border: '1px dashed #EDD0D6' }}>
                <div style={{ fontSize: 60, color: T.burgundy, marginBottom: 20, opacity: 0.2 }}>✦</div>
                <div className="playfair" style={{ fontSize: 28, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 12 }}>Nothing saved yet</div>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                  Tap the heart on any piece you love — it will wait here for you ✦
                </p>
                <button className="btn-primary" style={{ width: 'auto', padding: '16px 48px' }} onClick={() => navigate('/shop')}>✦ &nbsp; Browse the shop</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 20 }}>
                {items.map((p) => (
                  <div key={p.id} className={`wish-item${removing === p.id ? ' removing' : ''}`} style={{ padding: '24px', background: '#fff', borderRadius: 24, border: '1px solid #EDD0D6', boxShadow: '0 10px 30px rgba(107, 26, 46, 0.03)' }}>
                    <div style={{ width: 120, height: 120, borderRadius: 20, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ opacity: 0.15, fontSize: 60, color: T.burgundy }}>✦</div>
                      {p.stock && p.stock <= 3 && (
                        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: T.burgundy, color: '#fff', borderRadius: 10, padding: '4px 12px', fontFamily: 'EB Garamond, serif', fontSize: 10, whiteSpace: 'nowrap' }}>low stock</div>
                      )}
                    </div>

                    <div style={{ flex: 1, marginLeft: 24 }}>
                      <div className="playfair" style={{ fontStyle: 'italic', fontSize: 24, color: T.burgundyDeep, marginBottom: 6 }}>{p.name}</div>
                      <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted, marginBottom: 14 }}>{p.sub}</div>
                      <div className="playfair" style={{ fontSize: 22, color: T.burgundy }}>Rs {p.price}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
                      <button style={{ background: 'transparent', border: 'none', color: T.borderMuted, fontSize: 32, cursor: 'pointer', lineHeight: 1 }} onClick={() => handleRemove(p.id)}>×</button>
                      <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', fontSize: 14 }} onClick={() => addItem(p)}>+ Add to bag</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Column: Add all & Suggestions */}
          {items.length > 0 && (
            <div style={{ position: 'sticky', top: 120 }}>
              <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #EDD0D6', marginBottom: 40, boxShadow: '0 15px 40px rgba(107, 26, 46, 0.05)' }}>
                <div className="playfair" style={{ fontSize: 22, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 20 }}>Bag summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted }}>{items.length} pieces saved</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', padding: '16px' }} onClick={addAllToBag}>
                  ✦ &nbsp; Add all to bag
                </button>
              </div>

              {SUGGESTIONS.length > 0 && (
                <div>
                  <div className="playfair" style={{ fontSize: 20, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 20 }}>You might love</div>
                  <div style={{ display: 'grid', gap: 16 }}>
                    {SUGGESTIONS.map((p) => (
                      <div key={p.id} className="mini-card" onClick={() => navigate(`/shop/${p.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px', background: '#fff', borderRadius: 16, border: '1px solid #EDD0D6' }}>
                        <div style={{ width: 60, height: 60, borderRadius: 10, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>✦</div>
                        <div>
                          <div className="playfair" style={{ fontStyle: 'italic', fontSize: 15, color: T.burgundyDeep, lineHeight: 1.2 }}>{p.name}</div>
                          <div className="playfair" style={{ fontSize: 15, color: T.burgundy, marginTop: 2 }}>Rs {p.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

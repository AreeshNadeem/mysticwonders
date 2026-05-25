import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import Navbar from '../components/layout/Navbar';
import { T } from '../lib/constants';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, subtotal } = useCartStore();
  const total = subtotal();

  return (
    <div className="scroll-area" style={{ background: T.blushBg, minHeight: '100vh', paddingBottom: 100 }}>
      <Navbar />

      <div className="content-wrap" style={{ marginTop: 40, marginBottom: 80 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow" style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 12 }}>✦ &nbsp; your selection</div>
            <h1 className="playfair" style={{ fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(42px, 5vw, 64px)', color: T.burgundyDeep }}>Shopping Bag</h1>
          </div>

          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0 60px' }}>
            {[
              { n: '1', label: 'Bag', active: true }, 
              { n: '2', label: 'Delivery', inactive: true }, 
              { n: '3', label: 'Confirm', inactive: true }
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.inactive ? '#EDD0D6' : T.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'EB Garamond, serif', fontSize: 12, color: s.inactive ? T.textMuted : T.blushLight }}>{s.n}</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.08em', color: s.inactive ? T.textMuted : T.burgundy, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
                {i < 2 && <div style={{ width: 'clamp(40px, 10vw, 80px)', height: '0.5px', background: '#EDD0D6', margin: '0 8px', marginBottom: 20 }} />}
              </div>
            ))}
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', background: '#fff', borderRadius: 24, border: '0.5px solid #EDD0D6' }}>
              <div style={{ fontSize: 40, marginBottom: 24, opacity: 0.2 }}>✦</div>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 20, color: T.textMuted, fontStyle: 'italic', marginBottom: 32 }}>Your bag is currently empty</p>
              <button 
                onClick={() => navigate('/shop')}
                className="btn-primary"
                style={{ padding: '16px 40px', borderRadius: 40 }}
              >
                Explore the Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '40px 60px', alignItems: 'start' }}>
              {/* Left: Items List */}
              <div style={{ display: 'grid', gap: 20 }}>
                {items.map((item) => (
                  <div key={item.cartKey} style={{ background: '#fff', padding: 24, borderRadius: 24, border: '0.5px solid #EDD0D6', display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ width: 100, height: 100, borderRadius: 16, background: item.bg || '#FDEEF2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {item.image ? (
                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 32 }}>✦</span>
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div>
                          <div className="playfair" style={{ fontSize: 20, fontStyle: 'italic', color: T.burgundyDeep }}>{item.name}</div>
                          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.textMuted }}>{item.sub}</div>
                          {item.selectedOption && (
                            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, color: T.textAccent, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>
                              Option: {item.selectedOption.name}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => removeItem(item.cartKey)}
                          style={{ background: 'none', border: 'none', color: '#C47080', cursor: 'pointer', fontSize: 20, padding: 4 }}
                        >
                          ×
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #EDD0D6', borderRadius: 24, padding: '4px 10px', gap: 12 }}>
                          <button 
                            onClick={() => updateQty(item.cartKey, item.qty - 1)}
                            style={{ background: 'none', border: 'none', color: T.burgundy, fontSize: 18, cursor: 'pointer', padding: '0 4px' }}
                          >
                            −
                          </button>
                          <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.cartKey, item.qty + 1)}
                            style={{ background: 'none', border: 'none', color: T.burgundy, fontSize: 20, cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>
                        <div className="playfair" style={{ fontSize: 20, color: T.burgundy }}>Rs {item.price * item.qty}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Summary Card */}
              <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '0.5px solid #EDD0D6', position: 'sticky', top: 120 }}>
                <h3 className="playfair" style={{ fontSize: 22, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 24 }}>Order Summary</h3>
                
                <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
                  <div style={{ textAlign: 'center', marginBottom: 8, fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textMuted, fontStyle: 'italic' }}>
                    shipping calculated at checkout ✦
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted }}>Subtotal</span>
                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.burgundyDeep }}>Rs {total}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted }}>Delivery</span>
                    <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted, fontStyle: 'italic' }}>—</span>
                  </div>
                </div>

                <div style={{ height: '0.5px', background: '#EDD0D6', marginBottom: 24 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
                   <span className="playfair" style={{ fontSize: 18, color: T.burgundyDeep }}>Estimated Total</span>
                   <span className="playfair" style={{ fontSize: 28, color: T.burgundy }}>Rs {total}</span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="btn-primary hover-scale"
                  style={{ width: '100%', padding: '18px', borderRadius: 40, fontSize: 16 }}
                >
                  Proceed to Checkout ✦
                </button>
                
                <button 
                  onClick={() => navigate('/shop')}
                  style={{ width: '100%', marginTop: 16, background: 'none', border: 'none', fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.textMuted, cursor: 'pointer', fontStyle: 'italic' }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

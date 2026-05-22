import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { T } from '../lib/constants';
import Navbar from '../components/layout/Navbar';
import useCartStore    from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { useProducts } from '../hooks/useProducts';

const ACC = {
  'Care instructions': 'Avoid water and perfume. Store in a dry place. Clean gently with a soft cloth.',
  'Delivery across Pakistan': 'We deliver nationwide via TCS & Leopards. Estimated 3–5 business days.',
  'Custom orders': 'Want a personalised piece? DM us on Instagram or WhatsApp — we love custom orders!',
};

export default function ProductDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { products, loading } = useProducts();
  
  const p = products.find((x) => String(x.id) === String(id));
  const [open, setOpen] = useState(null);

  const addItem  = useCartStore((s) => s.addItem);
  const toggle   = useWishlistStore((s) => s.toggle);
  const isSaved  = useWishlistStore((s) => s.isSaved(p?.id));

  if (loading) return <div style={{ height: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!p) return <div style={{ height: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/shop')}>Product not found. Return to shop?</div>;

  const handleAdd = () => {
    if (!p.soldOut) addItem(p);
  };

  return (
    <div className="scroll-area" style={{ background: T.cream }}>
      <Navbar />

      <div className="content-wrap" style={{ marginTop: 60, marginBottom: 100, maxWidth: 1400 }}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 'clamp(40px, 5vw, 80px)', alignItems: 'start' }}>
            
            {/* Hero image - Enlarged */}
            <div style={{ width: '100%', aspectRatio: '1', background: `linear-gradient(160deg, ${p.bg} 0%, #EDD0D6 55%, #E4C0CA 100%)`, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(107, 26, 46, 0.08)' }}>
              {p.image ? (
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ opacity: 0.15, fontSize: 160, color: T.burgundy }}>✦</div>
                  {p.emoji}
                </div>
              )}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 390 360" fill="none">
                <circle cx="360" cy="30" r="80" stroke="#D4919F" strokeWidth="0.5" opacity="0.4"/>
                <circle cx="30" cy="320" r="60" stroke="#D4919F" strokeWidth="0.4" opacity="0.3"/>
              </svg>
            </div>

            {/* Product Info */}
            <div style={{ padding: '0 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[p.category, '✦ Handmade', p.badge].filter(Boolean).map((tag) => (
                    <span key={tag} style={{ background: T.blushLight, color: T.burgundy, borderRadius: 20, padding: '4px 14px', fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.04em' }}>{tag}</span>
                  ))}
                </div>
                <button onClick={() => toggle(p)} style={{ fontSize: 28, color: isSaved ? T.burgundy : T.textAccent, cursor: 'pointer', background: 'transparent', border: 'none', transition: 'transform 0.2s ease' }} className="hover-scale">
                  {isSaved ? '♥' : '♡'}
                </button>
              </div>

              <h1 className="playfair" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 12, lineHeight: 1.1 }}>{p.name}</h1>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textAccent, fontStyle: 'italic', marginBottom: 24, lineHeight: 1.5 }}>
                a small reminder that good vibes<br/>are always with you
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
                <span className="playfair" style={{ fontSize: 34, color: T.burgundy }}>Rs {p.price}</span>
                {p.stock && <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted, fontStyle: 'italic' }}>· only {p.stock} left in stock</span>}
              </div>

              {/* Inspiration */}
              {p.inspiration && (
                <div style={{ background: '#FBE8EC', borderRadius: 20, borderLeft: `4px solid ${T.burgundy}`, padding: '20px 24px', marginBottom: 32 }}>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 8 }}>✦ the inspiration</div>
                  <div className="playfair" style={{ fontSize: 18, fontStyle: 'italic', color: T.burgundyDeep, lineHeight: 1.6 }}>"{p.inspiration}"</div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
                <button className="btn-primary hover-scale" style={{ flex: 2, padding: '12px' }} onClick={() => { handleAdd(); }}>
                  ✦ &nbsp; Add to bag
                </button>
                <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => toggle(p)}>
                  {isSaved ? '♥ Saved' : '♡ Save'}
                </button>
              </div>

              {/* Details grid */}
              {p.details && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}>
                  {Object.entries(p.details).map(([k, v]) => (
                    <div key={k} style={{ background: '#fff', border: '0.5px solid #EDD0D6', borderRadius: 14, padding: '16px' }}>
                      <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                      <div className="playfair" style={{ fontSize: 15, color: T.burgundyDeep }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Accordion */}
              <div style={{ borderTop: '0.5px solid #EDD0D6' }}>
                {Object.entries(ACC).map(([label, content]) => (
                  <div key={label} style={{ borderBottom: '0.5px solid #EDD0D6' }}>
                    <div className="accordion-row" style={{ padding: '20px 0', border: 'none' }} onClick={() => setOpen(open === label ? null : label)}>
                      <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, letterSpacing: '0.08em', color: T.burgundyDeep, textTransform: 'uppercase' }}>{label}</span>
                      <span style={{ color: T.textAccent, fontSize: 18 }}>{open === label ? '−' : '+'}</span>
                    </div>
                    {open === label && (
                      <div className="fade-down" style={{ fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted, lineHeight: 1.8, padding: '0 0 20px' }}>{content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* You may also like */}
          <div style={{ marginTop: 80, paddingTop: 40, borderTop: '0.5px solid #EDD0D6' }}>
            <div className="playfair" style={{ fontSize: 24, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 32 }}>You may also like</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
              {products.filter((x) => x.id !== p.id).slice(0, 4).map((r) => (
                <div key={r.id} className="mini-card shadow-sm" onClick={() => navigate(`/shop/${r.id}`)}>
                  <div style={{ width: '100%', aspectRatio: 1, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, overflow: 'hidden' }}>
                    {r.image ? <img src={r.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : r.emoji}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div className="playfair" style={{ fontStyle: 'italic', fontSize: 18, color: T.burgundyDeep, marginBottom: 4, lineHeight: 1.2 }}>{r.name}</div>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundy }}>Rs {r.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

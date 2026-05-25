import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '../lib/constants';
import Navbar from '../components/layout/Navbar';
import useCartStore    from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { useProducts } from '../hooks/useProducts';
import ProductReviews from '../components/ui/ProductReviews';

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
  const [activeImg, setActiveImg] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const addItem  = useCartStore((s) => s.addItem);
  const toggle   = useWishlistStore((s) => s.toggle);
  const isSaved  = useWishlistStore((s) => s.isSaved(p?.id));

  useEffect(() => {
    if (p && p.options?.length > 0) {
      setSelectedOption(p.options[0]);
    } else {
      setSelectedOption(null);
    }
  }, [p]);

  if (loading) return <div style={{ height: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!p) return <div style={{ height: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/shop')}>Product not found. Return to shop?</div>;

  const currentPrice = selectedOption ? selectedOption.price : p.price;
  const pImages = p.images?.length > 0 ? p.images : [p.image].filter(Boolean);

  const handleAdd = () => {
    if (!p.soldOut) {
      addItem({
        ...p,
        image: pImages[0] || null,
        price: currentPrice,
        selectedOption
      });
    }
  };

  return (
    <div className="scroll-area" style={{ background: T.cream }}>
      <Navbar />

      <div className="content-wrap" style={{ marginTop: 60, marginBottom: 100, maxWidth: 1400 }}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 'clamp(40px, 5vw, 80px)', alignItems: 'start' }}>
            
            {/* Image Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ width: '100%', aspectRatio: '1', background: `linear-gradient(160deg, ${p.bg} 0%, #EDD0D6 55%, #E4C0CA 100%)`, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(107, 26, 46, 0.08)' }}>
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImg}
                    src={pImages[activeImg]} 
                    alt={p.name} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </AnimatePresence>
                
                {pImages.length > 1 && (
                  <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {pImages.map((_, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveImg(i)}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: i === activeImg ? T.burgundy : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }} 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {pImages.length > 1 && (
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>
                  {pImages.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveImg(i)}
                      style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: i === activeImg ? `2px solid ${T.burgundy}` : '2px solid transparent', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
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
                <span className="playfair" style={{ fontSize: 34, color: T.burgundy }}>Rs {currentPrice}</span>
                {p.stock && <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted, fontStyle: 'italic' }}>· only {p.stock} left in stock</span>}
              </div>

              {/* Options Selector */}
              {p.options?.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 12 }}>Choose your magic</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {p.options.map((opt) => (
                      <button
                        key={opt.name}
                        onClick={() => setSelectedOption(opt)}
                        style={{
                          padding: '10px 20px', borderRadius: 20, border: selectedOption?.name === opt.name ? `1px solid ${T.burgundy}` : '1px solid #EDD0D6',
                          background: selectedOption?.name === opt.name ? '#FFF7F8' : 'transparent',
                          color: selectedOption?.name === opt.name ? T.burgundy : T.textMuted,
                          fontFamily: 'EB Garamond, serif', fontSize: 15, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Inspiration */}
              {p.inspiration && (
                <div style={{ background: '#FBE8EC', borderRadius: 20, borderLeft: `4px solid ${T.burgundy}`, padding: '20px 24px', marginBottom: 32 }}>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 8 }}>✦ the inspiration</div>
                  <div className="playfair" style={{ fontSize: 18, fontStyle: 'italic', color: T.burgundyDeep, lineHeight: 1.6 }}>"{p.inspiration}"</div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
                <button className="btn-primary" 
                   style={{ flex: 2, padding: '14px', borderRadius: 30, opacity: p.soldOut ? 0.6 : 1 }} 
                   disabled={p.soldOut}
                   onClick={handleAdd}
                >
                  {p.soldOut ? 'Sold Out' : '✦ Add to bag'}
                </button>
                <button className="btn-outline" style={{ flex: 1, padding: '14px', borderRadius: 30 }} onClick={() => toggle(p)}>
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
                  <div style={{ width: '100%', aspectRatio: 1, background: r.bg || '#FDEEF2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {r.images?.[0] || r.image ? <img src={r.images?.[0] || r.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 44 }}>✦</span>}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div className="playfair" style={{ fontStyle: 'italic', fontSize: 18, color: T.burgundyDeep, marginBottom: 4, lineHeight: 1.2 }}>{r.name}</div>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundy }}>Rs {r.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Customer Reviews ── */}
          <ProductReviews productId={p.id} productName={p.name} />
        </div>
      </div>
    </div>
  );
}

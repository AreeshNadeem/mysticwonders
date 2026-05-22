import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Navbar from '../components/layout/Navbar';
import { T } from '../lib/constants';

/* ── ANIMATED BACKGROUND COMPONENTS ─────────────────────────────────────── */
const AnimatedBackground = () => (
  <div className="bg-canvas" aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      {/* ghost circles */}
      <circle cx="1200" cy="150" r="220" fill="none" stroke="#6B1A2E" strokeWidth="0.4" opacity="0.3" />
      <circle cx="200" cy="700" r="180" fill="none" stroke="#6B1A2E" strokeWidth="0.3" opacity="0.2" />
      <circle cx="720" cy="450" r="320" fill="none" stroke="#6B1A2E" strokeWidth="0.3" opacity="0.15" />
      {/* floating motifs */}
      <path className="float-star" d="M180 200 L183 210 L193 210 L185 216 L188 226 L180 220 L172 226 L175 216 L167 210 L177 210 Z" fill="#C47080" style={{ animation: 'floatStar 4s linear infinite', transformOrigin: 'center' }} />
      <path className="float-star" d="M1260 320 L1262 328 L1270 328 L1264 333 L1266 341 L1260 336 L1254 341 L1256 333 L1250 328 L1258 328 Z" fill="#8B3545" style={{ animation: 'floatStar 5.5s linear infinite 1.2s', transformOrigin: 'center' }} />
      <path className="float-star" d="M900 120 L902 128 L910 128 L904 133 L906 141 L900 136 L894 141 L896 133 L890 128 L898 128 Z" fill="#C47080" style={{ animation: 'floatStar 4.5s linear infinite 1.8s', transformOrigin: 'center' }} />
      {/* floating hearts */}
      <path className="float-heart" d="M240 380 C240 372,230 366,230 375 C230 382,240 388,240 388 C240 388,250 382,250 375 C250 366,240 372,240 380" fill="#8B3545" style={{ animation: 'floatHeart 5s ease-in-out infinite 0.5s' }} />
      <path className="float-heart" d="M1320 480 C1320 474,1313 469,1313 476 C1313 482,1320 487,1320 487 C1320 487,1327 482,1327 476 C1327 469,1320 474,1320 480" fill="#6B1A2E" style={{ animation: 'floatHeart 6s ease-in-out infinite 2.5s' }} />
    </svg>
  </div>
);

const BowCelebration = () => (
  <div className="celebration-ring" style={{ position: 'relative', width: 90, height: 90, marginBottom: 40, animation: 'popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both' }}>
    <div className="outer-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '0.5px solid rgba(196,112,128,0.25)', animation: 'ringExpand 2.5s ease-in-out infinite' }}></div>
    <div className="inner-circle" style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: T.burgundy, border: '0.5px solid rgba(247,214,220,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="42" height="32" viewBox="-32 -25 64 50" fill="none" style={{ overflow: 'visible' }}>
        {/* Guaranteed complete, elegant loops using proven brand path logic */}
        <path d="M0,0 C12,-16 28,-16 28,0 C28,16 12,16 0,0 Z" stroke="#F7D6DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0,0 C-12,-16 -28,-16 -28,0 C-28,16 -12,16 0,0 Z" stroke="#F7D6DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0,0 C4,10 8,22 6,30" stroke="#F7D6DC" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M0,0 C-4,10 -8,22 -6,30" stroke="#F7D6DC" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="0" cy="0" r="4.5" fill="#F7D6DC" />
        <circle cx="0" cy="0" r="2" fill="#6B1A2E" />
      </svg>
    </div>
  </div>
);

/* ── MAIN COMPONENT ──────────────────────────────────────────────────────── */
export default function OrderPlaced() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'orders', id));
        if (snap.exists()) setOrder(snap.data());
      } catch (err) { console.error("Error fetching order:", err); }
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [id]);

  const orderNum = id ? id.slice(-8).toUpperCase() : 'NBXEOWPO';
  const address = order?.deliveryDetails?.address || 'Street 21, Islamabad';
  const phone = order?.deliveryDetails?.phone || '0320 9276651';
  const payment = order?.paymentMethod === 'cod' ? 'Cash on delivery' : (order?.paymentMethod || 'Cash on delivery');
  const items = order?.items || [
    { name: 'Lucky Knot Keychain', tags: ['braided', 'gold charm'], qty: 1, price: 450, emoji: '🗝️' },
    { name: 'Merci Necklace', tags: ['layering', 'beaded'], qty: 1, price: 650, emoji: '📿', bg: '#EDE0EC' }
  ];
  const total = order?.total || 1250;

  return (
    <div className="scroll-area" style={{ background: '#1A0509', minHeight: '100vh', position: 'relative' }}>
      <Navbar />
      <AnimatedBackground />

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 24px 64px' }}>
        <BowCelebration />

        <div className="eyebrow" style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C47080', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp 0.6s 0.3s ease both' }}>
          <span style={{ width: 32, height: '0.5px', background: '#C47080', opacity: 0.5 }}></span>
          ✦ &nbsp; order confirmed
          <span style={{ width: 32, height: '0.5px', background: '#C47080', opacity: 0.5 }}></span>
        </div>

        <h1 className="hero-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(52px, 8vw, 88px)', lineHeight: 1.05, color: '#F7D6DC', marginBottom: 24, letterSpacing: '-0.01em', animation: 'fadeUp 0.7s 0.4s ease both' }}>
          Your wonder<br />is on its way
        </h1>

        <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 19, color: '#C47080', lineHeight: 1.7, maxWidth: 520, animation: 'fadeUp 0.7s 0.5s ease both' }}>
          We're already tying the knots just for you.<br />
          Get ready to meet your new favourite piece ✦
        </p>
      </section>

      {/* CONTENT CARD */}
      <div className="content-wrap" style={{ position: 'relative', zIndex: 1, maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>

        <div style={{ background: '#6B1A2E', borderRadius: '20px 20px 0 0', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeUp 0.6s 0.55s ease both' }}>
          <div>
            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(247,214,220,0.6)', marginBottom: 4 }}>Order number</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 22, color: '#F7D6DC', letterSpacing: '0.04em' }}>#{orderNum}</div>
          </div>
          <div style={{ background: 'rgba(247,214,220,0.12)', border: '0.5px solid rgba(247,214,220,0.3)', borderRadius: 30, padding: '8px 20px', fontFamily: 'EB Garamond, serif', fontSize: 13, color: '#F7D6DC', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'pulse 2s ease-in-out infinite' }}></div>
            Confirmed
          </div>
        </div>

        <div style={{ background: '#FDEEF2', borderRadius: '0 0 20px 20px', padding: '40px 32px 36px', animation: 'fadeUp 0.6s 0.65s ease both' }}>

          {/* INFO GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', border: '0.5px solid #EDD0D6', borderRadius: 14, overflow: 'hidden', marginBottom: 36, background: '#fff' }}>
            {[
              { label: 'DELIVERING TO', value: address, icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /> },
              { label: 'WHATSAPP', value: phone, icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 011.18 2.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /> },
              { label: 'PAYMENT', value: payment, icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></> }
            ].map((cell, idx) => (
              <div key={idx} style={{ padding: '24px', borderRight: idx < 2 ? '0.5px solid #EDD0D6' : 'none', borderBottom: 'none', position: 'relative' }}>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B6070', marginBottom: 8, opacity: 0.8 }}>{cell.label}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 19, color: '#1A0509', lineHeight: 1.2 }}>{cell.value}</div>
                <svg style={{ position: 'absolute', top: 22, right: 22, opacity: 0.15 }} width="16" height="16" fill="none" stroke="#6B1A2E" strokeWidth="1.2" viewBox="0 0 24 24">{cell.icon}</svg>
              </div>
            ))}
          </div>

          {/* ITEM LIST */}
          <div style={{ marginBottom: 32 }}>
            <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontFamily: 'EB Garamond, serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B6070' }}>
              <div style={{ flex: 1, height: '0.5px', background: '#EDD0D6' }}></div>
              ✦ &nbsp; your pieces &nbsp; ✦
              <div style={{ flex: 1, height: '0.5px', background: '#EDD0D6' }}></div>
            </div>

            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '0.5px solid #F5E0E6' }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: item.bg || '#F5E0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{item.emoji || '✨'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 17, color: '#1A0509', marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: '#9B6070' }}>{item.tags?.join(' · ')} · qty {item.qty}</div>
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: '#6B1A2E' }}>Rs {item.price}</div>
              </div>
            ))}

            {/* Fixed: Single line for total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 24, borderTop: '0.5px solid #EDD0D6', marginTop: 12 }}>
              <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9B6070' }}>TOTAL PAID</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 32, color: '#1A0509' }}>Rs {total}</span>
            </div>
          </div>

          {/* TRACKER (Reverted to White Background and Fixed Icons/Line) */}
          <div style={{ background: '#fff', border: '0.5px solid #EDD0D6', borderRadius: 20, padding: '32px 24px', marginBottom: 28 }}>
            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9B6070', textAlign: 'center', marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 20, height: '0.5px', background: '#C47080', opacity: 0.4 }}></div>
              ✦ &nbsp; your order journey &nbsp; ✦
              <div style={{ width: 20, height: '0.5px', background: '#C47080', opacity: 0.4 }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', maxWidth: 640, margin: '0 auto' }}>
              {/* Tracker lines behind icons */}
              <div style={{ position: 'absolute', top: 18, left: '12.5%', right: '12.5%', height: '1px', background: '#EDD0D6', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: 18, left: '12.5%', width: '25%', height: '1px', background: '#6B1A2E', zIndex: 1 }}></div>

              {[
                { label: 'Order\nplaced', active: false, done: true, icon: <path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /> },
                {
                  label: 'Being\nmade',
                  active: false,
                  done: false,
                  icon: <svg viewBox="-3 -2 20 20" width="15" height="15" fill="none"><path d="M8 0L9.8 5.6H15.8L11 9.1L12.8 14.7L8 11.2L3.2 14.7L5 9.1L0.2 5.6H6.2L8 0Z" fill="#6B1A2E" /></svg>
                },
                {
                  label: 'Packed &\nshipped',
                  active: false,
                  done: false,
                  icon: (
                    <g stroke="#6B1A2E" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="12" width="14" height="9" rx="1" />
                      <rect x="4" y="9" width="16" height="3" rx="0.5" />
                      <line x1="12" y1="9" x2="12" y2="21" strokeWidth="1" />
                      <path d="M12,9 C15,5 18,7 15,9 C13.5,10 12.5,9 12,9 Z" strokeWidth="1.1" />
                      <path d="M12,9 C9,5 6,7 9,9 C10.5,10 11.5,9 12,9 Z" strokeWidth="1.1" />
                    </g>
                  )
                },
                {
                  label: 'With\nyou',
                  active: false,
                  done: false,
                  icon: (
                    <>
                      <path d="M8 8 C6 4 1 4 1 8 C1 12 6 12 8 8 Z" stroke="#6B1A2E" fill="none" strokeWidth="1.1" />
                      <path d="M8 8 C10 4 15 4 15 8 C15 12 10 12 8 8 Z" stroke="#6B1A2E" fill="none" strokeWidth="1.1" />
                      <path d="M8 8 L6 14" stroke="#6B1A2E" strokeWidth="1" />
                      <path d="M8 8 L10 14" stroke="#6B1A2E" strokeWidth="1" />
                      <circle cx="8" cy="8" r="1.5" fill="#6B1A2E" />
                    </>
                  )
                }
              ].map((step, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2, width: 85 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step.done || step.active ? '#6B1A2E' : '#fff',
                    border: step.done || step.active ? 'none' : '0.5px solid #EDD0D6',
                    boxShadow: step.active ? '0 0 0 5px rgba(107,26,46,0.08)' : 'none',
                  }}>
                    <svg width="18" height="18" viewBox={idx === 2 ? "0 0 24 24" : "0 0 16 16"} fill="none">{step.icon}</svg>
                  </div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, color: step.active || step.done ? '#6B1A2E' : '#9B6070', textAlign: 'center', fontStyle: step.active ? 'italic' : 'normal', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{step.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* WHATSAPP BANNER (Fixed: No green!) */}
          <div style={{ background: 'linear-gradient(135deg, #3D0A16 0%, #1A0509 100%)', border: '0.5px solid rgba(196,112,128,0.2)', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#6B1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#F7D6DC"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(196,112,128,0.7)', marginBottom: 3 }}>✦ &nbsp; personal updates</div>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: 'rgba(247,214,220,0.8)', lineHeight: 1.5 }}>
                We'll send you updates on <strong style={{ color: '#F7D6DC', fontWeight: '500' }}>WhatsApp</strong> as your order moves from our studio to your door ✦
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTIONS (Fixed: Limited Width) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, maxWidth: 520, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>
        <button onClick={() => navigate('/shop')} className="btn-primary" style={{ flex: 1, borderRadius: 50, padding: '16px 20px', fontFamily: 'EB Garamond, serif', fontSize: 14, letterSpacing: '0.08em', cursor: 'pointer' }}>✦ &nbsp; Keep shopping</button>
        <button className="btn-outline" style={{ flex: 1, borderRadius: 50, padding: '16px 20px', fontFamily: 'EB Garamond, serif', fontSize: 14, letterSpacing: '0.06em', cursor: 'pointer', background: 'transparent', color: '#F7D6DC', border: '0.5px solid rgba(247,214,220,0.3)' }}>✦ &nbsp; Share the love</button>
      </div>
    </div>
  );
}
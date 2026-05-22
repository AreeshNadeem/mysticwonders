import { useState } from 'react';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Navbar from '../components/layout/Navbar';
import { T } from '../lib/constants';

/* ── ANIMATED BACKGROUND ────────────────────────────────────────────────── */
const AnimatedBackground = () => (
  <div className="bg-canvas" aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      {/* ghost circles */}
      <circle cx="1200" cy="150" r="220" fill="none" stroke="#6B1A2E" strokeWidth="0.5" opacity="0.4" />
      <circle cx="200" cy="700" r="180" fill="none" stroke="#6B1A2E" strokeWidth="0.4" opacity="0.3" />
      <circle cx="720" cy="450" r="320" fill="none" stroke="#6B1A2E" strokeWidth="0.4" opacity="0.2" />
      {/* floating motifs */}
      <path className="float-star" d="M180 200 L183 210 L193 210 L185 216 L188 226 L180 220 L172 226 L175 216 L167 210 L177 210 Z" fill="#C47080" style={{ opacity: 0.8, animation: 'floatStar 4s linear infinite', transformOrigin: 'center' }} />
      <path className="float-star" d="M1260 320 L1262 328 L1270 328 L1264 333 L1266 341 L1260 336 L1254 341 L1256 333 L1250 328 L1258 328 Z" fill="#8B3545" style={{ opacity: 0.7, animation: 'floatStar 5.5s linear infinite 1.2s', transformOrigin: 'center' }} />
      <path className="float-heart" d="M240 380 C240 372,230 366,230 375 C230 382,240 388,240 388 C240 388,250 382,250 375 C250 366,240 372,240 380" fill="#8B3545" style={{ opacity: 0.6, animation: 'floatHeart 5s ease-in-out infinite 0.5s' }} />
      <path className="float-heart" d="M1100 100 C1100 92,1090 86,1090 95 C1090 102,1100 108,1100 108 C1100 108,1110 102,1110 95 C1110 86,1100 92,1100 100" fill="#C47080" style={{ opacity: 0.5, animation: 'floatHeart 6s ease-in-out infinite 3s' }} />
    </svg>
  </div>
);

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    let cleanedId = orderId.trim();
    if (cleanedId.startsWith('#')) cleanedId = cleanedId.slice(1);

    if (!cleanedId) return;

    setLoading(true);
    setError('');
    setOrder(null);

    console.log("Searching for order:", cleanedId);

    try {
      // 1. Try Direct ID Fetch
      const snap = await getDoc(doc(db, 'orders', cleanedId));
      if (snap.exists()) {
        setOrder(snap.data());
        return;
      }

      // 2. Fallback: Search by short 8-char ID
      // If the input is 8 chars, we look for matches in the most recent 100 orders
      if (cleanedId.length === 8) {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100));
        const qSnap = await getDocs(q);
        const match = qSnap.docs.find(d => d.id.slice(-8).toUpperCase() === cleanedId.toUpperCase());

        if (match) {
          setOrder(match.data());
          return;
        }
      }

      setError(`We couldn’t find order #${cleanedId}. Please ensure you're using the 8-character ID from your confirmation screen ✦`);
    } catch (err) {
      console.error("Track error:", err);
      setError('An error occurred while tracking your order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scroll-area" style={{ background: '#1A0509', minHeight: '100vh', position: 'relative' }}>
      <Navbar />
      <AnimatedBackground />

      <section style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '100px 24px 60px' }}>
        <div className="eyebrow" style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C47080', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: '0.5px', background: '#C47080', opacity: 0.5 }}></span>
          ✦ &nbsp; stay connected
          <span style={{ width: 32, height: '0.5px', background: '#C47080', opacity: 0.5 }}></span>
        </div>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(42px, 6vw, 72px)', lineHeight: 1.1, color: '#F7D6DC', marginBottom: 24, letterSpacing: '-0.01em' }}>
          Track your wonder
        </h1>

        <form onSubmit={handleTrack} style={{ width: '100%', maxWidth: 440, background: 'rgba(107, 26, 46, 0.1)', border: '0.5px solid rgba(196, 112, 128, 0.2)', padding: '8px', borderRadius: 50, display: 'flex', gap: 8, backdropFilter: 'blur(10px)', marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', padding: '0 24px', color: '#F7D6DC', fontFamily: 'EB Garamond, serif', fontSize: 16, outline: 'none' }}
          />
          <button type="submit" disabled={loading} style={{ background: '#6B1A2E', color: '#F7D6DC', border: 'none', padding: '12px 32px', borderRadius: 40, fontFamily: 'EB Garamond, serif', fontSize: 14, cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && <p style={{ color: '#C47080', fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 15 }}>{error}</p>}
      </section>

      {order && (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', padding: '0 24px 100px', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ background: '#ffffffff', border: '0.5px solid #EDD0D6', borderRadius: 24, padding: '48px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>

            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B6070', marginBottom: 8 }}>Order #{orderId.slice(-8).toUpperCase()}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 24, color: T.burgundyDeep }}>Current Status: {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing'}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', maxWidth: 540, margin: '0 auto' }}>
              <div style={{ position: 'absolute', top: 18, left: '12.5%', right: '12.5%', height: '1px', background: '#EDD0D6', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: 18, left: '12.5%', width: '25%', height: '1px', background: '#6B1A2E', zIndex: 1 }}></div>

              {[
                {
                  label: 'Order\nplaced',
                  active: order?.status === 'pending',
                  done: order?.status !== 'pending' && order?.status !== undefined,
                  icon: (color) => <path d="M3 8l3.5 3.5L13 4.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
                },
                {
                  label: 'Being\nmade',
                  active: order?.status === 'made',
                  done: order?.status === 'Out for delivery' || order?.status === 'Completed',
                  icon: (color) => <path d="M8 0L9.8 5.6H15.8L11 9.1L12.8 14.7L8 11.2L3.2 14.7L5 9.1L0.2 5.6H6.2L8 0Z" fill={color} />
                },
                {
                  label: 'Packed &\nshipped',
                  active: order?.status === 'Out for delivery',
                  done: order?.status === 'Completed',
                  icon: (color) => (
                    <g stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
                  active: order?.status === 'Completed',
                  done: false,
                  icon: (color) => (
                    <>
                      <path d="M8 8 C6 4 1 4 1 8 C1 12 6 12 8 8 Z" stroke={color} fill="none" strokeWidth="1.1" />
                      <path d="M8 8 C10 4 15 4 15 8 C15 12 10 12 8 8 Z" stroke={color} fill="none" strokeWidth="1.1" />
                      <path d="M8 8 L6 14" stroke={color} strokeWidth="1" />
                      <path d="M8 8 L10 14" stroke={color} strokeWidth="1" />
                      <circle cx="8" cy="8" r="1.5" fill={color} />
                    </>
                  )
                }
              ].map((step, idx) => {
                const isHighlighted = step.active || step.done;
                const iconColor = isHighlighted ? '#fff' : '#6B1A2E';
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2, width: 85 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isHighlighted ? '#6B1A2E' : '#fff',
                      border: isHighlighted ? 'none' : '0.5px solid #EDD0D6',
                      boxShadow: step.active ? '0 0 0 5px rgba(107,26,46,0.08)' : 'none',
                    }}>
                      <svg width="18" height="18" viewBox={idx === 1 ? "-3 -2 20 20" : idx === 2 ? "0 0 24 24" : "0 0 16 16"} fill="none">
                        {typeof step.icon === 'function' ? step.icon(iconColor) : step.icon}
                      </svg>
                    </div>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: isHighlighted ? '#6B1A2E' : '#9B6070', textAlign: 'center', fontStyle: step.active ? 'italic' : 'normal', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

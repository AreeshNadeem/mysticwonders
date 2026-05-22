import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { T } from '../../lib/constants';

// Decorative quote SVG
const QuoteIcon = () => (
  <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
    <path d="M0 24V14.4C0 10.56 0.96 7.28 2.88 4.56C4.88 1.84 7.68 0.08 11.28 0L12 2.4C9.52 3.04 7.64 4.24 6.36 6C5.16 7.68 4.56 9.6 4.56 11.76H9.6V24H0ZM19.2 24V14.4C19.2 10.56 20.16 7.28 22.08 4.56C24.08 1.84 26.88 0.08 30.48 0L31.2 2.4C28.72 3.04 26.84 4.24 25.56 6C24.36 7.68 23.76 9.6 23.76 11.76H28.8V24H19.2Z" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Placeholder avatars — beautiful initials display
function Avatar({ name, image }) {
  const initials = (name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#C47080', '#A35060', '#8B3545', '#D4919F', '#B06070'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return image ? (
    <img src={image} alt={name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)' }} />
  ) : (
    <div style={{ width: 52, height: 52, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: '#fff', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  // Fallback reviews to display when DB is empty
  const fallbackReviews = [
    { id: 'f1', name: 'Maryam A.', comment: 'I got the lucky knot keychain for myself and honestly it is the most adorable thing. The craftsmanship is so delicate and it arrived beautifully wrapped!', createdAt: '' },
    { id: 'f2', name: 'Fatima R.', comment: 'Ordered the merci necklace as a gift — my friend was absolutely obsessed. The quality exceeded my expectations for a handmade piece. Will definitely be ordering again.', createdAt: '' },
    { id: 'f3', name: 'Zara K.', comment: 'The packaging alone made me feel so special! The bracelet is dainty and beautiful. You can tell so much love goes into every single piece.', createdAt: '' },
    { id: 'f4', name: 'Hina M.', comment: 'Been following Mystic Wonders for so long and finally ordered — definitely not disappointed. Shipped so fast and the items are even prettier in person!', createdAt: '' },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(12));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setReviews(fetched.length >= 2 ? fetched : fallbackReviews);
      } catch {
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Auto-cycle through reviews
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  const visible = reviews.length > 0 ? [
    reviews[current],
    reviews[(current + 1) % reviews.length],
    reviews[(current + 2) % reviews.length],
  ] : [];

  return (
    <section style={{ background: T.dark, padding: 'clamp(60px, 8vw, 120px) 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background decorative circles */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1200 600" fill="none" preserveAspectRatio="xMidYMid slice">
        <circle cx="100" cy="100" r="200" stroke="#6B1A2E" strokeWidth="0.5" opacity="0.2" />
        <circle cx="1100" cy="500" r="250" stroke="#6B1A2E" strokeWidth="0.4" opacity="0.15" />
        <circle cx="600" cy="300" r="400" stroke="#6B1A2E" strokeWidth="0.3" opacity="0.08" />
        <path d="M1050 80 L1056 98 L1074 98 L1060 109 L1066 127 L1050 116 L1034 127 L1040 109 L1026 98 L1044 98 Z" fill="#6B1A2E" opacity="0.25" />
        <path d="M150 480 L154 492 L166 492 L156 499 L160 511 L150 504 L140 511 L144 499 L134 492 L146 492 Z" fill="#6B1A2E" opacity="0.2" />
      </svg>

      <div className="content-wrap" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.25em', color: '#C47080', textTransform: 'uppercase', marginBottom: 16 }}>✦ &nbsp; from our community &nbsp; ✦</div>
          <h2 className="playfair section-h2" style={{ fontStyle: 'italic', color: '#F7D6DC', lineHeight: 1.2 }}>Heard with love</h2>
          <div style={{ width: 60, height: 1, background: '#6B1A2E', margin: '24px auto 0' }} />
        </div>

        {/* Review cards grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, padding: '0 clamp(16px, 4vw, 48px)' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ height: 240, borderRadius: 24, background: 'rgba(107,26,46,0.12)', animation: 'skeleton-shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '0 clamp(16px, 4vw, 48px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
              <AnimatePresence mode="wait">
                {visible.map((review, i) => review && (
                  <motion.div
                    key={`${review.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '0.5px solid rgba(107,26,46,0.4)',
                      borderRadius: 28,
                      padding: 'clamp(24px, 4vw, 36px)',
                      backdropFilter: 'blur(8px)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decorative gradient corner */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle at top right, rgba(107,26,46,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    {/* Quote icon */}
                    <div style={{ color: '#C47080', marginBottom: 16 }}>
                      <QuoteIcon />
                    </div>

                    {/* Review image (optional) */}
                    {review.image && (
                      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
                        <img src={review.image} alt="Review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}

                    {/* Comment */}
                    <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(16px, 2vw, 18px)', color: '#D4A0AC', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 24 }}>
                      "{review.comment}"
                    </p>

                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <Avatar name={review.name} image={review.photoUrl} />
                      <div>
                        <div className="playfair" style={{ fontSize: 15, color: '#F7D6DC', fontStyle: 'italic' }}>{review.name}</div>
                        {review.productName && <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, color: '#9B6070', letterSpacing: '0.05em' }}>purchased · {review.productName}</div>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 24 : 8, height: 8, borderRadius: 4,
                    background: i === current ? '#C47080' : 'rgba(196,112,128,0.3)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease', padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

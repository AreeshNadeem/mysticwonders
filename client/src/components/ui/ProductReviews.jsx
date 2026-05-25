import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, addDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { T } from '../../lib/constants';

function Avatar({ name }) {
  const initials = (name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#C47080', '#A35060', '#8B3545', '#D4919F', '#B06070'];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#fff', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', comment: '', image: '' });

  useEffect(() => {
    if (!productId) return;
    
    console.log('Setting up reviews listener for product:', productId);
    
    // Query global reviews collection but filter for this product
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', String(productId)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snap) => {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log(`Fetched ${fetched.length} reviews for ${productId} from global collection`);
        setReviews(fetched);
        setLoading(false);
      },
      (err) => {
        console.error('Reviews listener error:', err);
        // Fallback: try querying without orderBy if index is missing
        const fallbackQ = query(
          collection(db, 'reviews'),
          where('productId', '==', String(productId))
        );
        onSnapshot(fallbackQ, (s) => {
          const f = s.docs.map(d => ({ id: d.id, ...d.data() }));
          f.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          setReviews(f);
          setLoading(false);
        });
      }
    );

    return () => unsubscribe();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    try {
      console.log('Submitting review for product:', productId, productName);
      
      const productReviewPromise = addDoc(collection(db, 'products', String(productId), 'reviews'), {
        name: form.name.trim(),
        comment: form.comment.trim(),
        image: form.image.trim() || null,
        productId: String(productId),
        productName,
        createdAt: new Date().toISOString(),
      });

      const globalReviewPromise = addDoc(collection(db, 'reviews'), {
        name: form.name.trim(),
        comment: form.comment.trim(),
        image: form.image.trim() || null,
        productId: String(productId),
        productName,
        createdAt: new Date().toISOString(),
      });

      const results = await Promise.allSettled([productReviewPromise, globalReviewPromise]);
      
      const errors = results.filter(r => r.status === 'rejected');
      if (errors.length > 0) {
        console.error('Some review writes failed:', errors);
        if (errors.length === 2) throw new Error('Both review writes failed');
      }

      console.log('Review submitted successfully');
      setSubmitted(true);
      setForm({ name: '', comment: '', image: '' });
      setShowForm(false);
      // Global listener handles update
    } catch (err) {
      alert(`Could not share review: ${err.message || 'Unknown error'}. Please check your connection and try again.`);
      console.error('Full review submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 60, paddingTop: 40, borderTop: '0.5px solid #EDD0D6' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 4 }}>✦ &nbsp; community</div>
          <div className="playfair" style={{ fontSize: 26, fontStyle: 'italic', color: T.burgundyDeep }}>What they're saying</div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setSubmitted(false); }}
          style={{ padding: '10px 24px', borderRadius: 24, background: showForm ? T.burgundy : 'transparent', color: showForm ? '#fff' : T.burgundy, border: `1px solid ${T.burgundy}`, fontFamily: 'EB Garamond, serif', fontSize: 15, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.03em' }}
        >
          {showForm ? '✕ Cancel' : '✦ Share yours'}
        </button>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: '#FBE8EC', border: `1px solid ${T.blushBorder}`, borderRadius: 16, padding: '16px 24px', marginBottom: 28, fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, fontStyle: 'italic' }}
          >
            ✦ Thank you for sharing your experience! Your review means the world. 
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 40 }}
          >
            <form onSubmit={handleSubmit} style={{ background: '#fff', border: '0.5px solid #EDD0D6', borderRadius: 24, padding: 'clamp(20px, 4vw, 32px)', display: 'grid', gap: 20, boxShadow: '0 12px 30px rgba(107,26,46,0.05)' }}>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textAccent }}>Your experience with {productName}</div>
              
              <div>
                <label style={{ display: 'block', fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Your Name</label>
                <input
                  required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Fatima R."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', fontFamily: 'EB Garamond, serif', fontSize: 16, outline: 'none', background: '#FFF7F8' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Your Review</label>
                <textarea
                  required value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  placeholder="Share how it made you feel..."
                  rows={4}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', fontFamily: 'EB Garamond, serif', fontSize: 16, outline: 'none', resize: 'none', background: '#FFF7F8', lineHeight: 1.6 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Photo Link <span style={{ textTransform: 'none', opacity: 0.6 }}>(optional — paste an image URL)</span></label>
                <input
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://imgur.com/your-photo.jpg"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', fontFamily: 'EB Garamond, serif', fontSize: 16, outline: 'none', background: '#FFF7F8' }}
                />
              </div>

              <button
                type="submit" disabled={submitting}
                className="btn-primary" style={{ padding: '14px', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Sharing...' : '✦ Share your review'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {loading ? (
        <div style={{ display: 'grid', gap: 16 }}>
          {[0, 1].map(i => <div key={i} style={{ height: 120, borderRadius: 20, background: 'linear-gradient(90deg, #FDF0F3 25%, #EDD0D6 50%, #FDF0F3 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.4s infinite' }} />)}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'EB Garamond, serif', fontStyle: 'italic', color: T.textMuted, fontSize: 18 }}>
          No reviews yet — be the first to share ✦
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fff', border: '0.5px solid #EDD0D6', borderRadius: 20, padding: 'clamp(20px, 4vw, 28px)', boxShadow: '0 4px 12px rgba(107,26,46,0.03)' }}
            >
              {/* Review photo */}
              {review.image && (
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                  <img src={review.image} alt="Review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Comment */}
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 17, color: T.burgundyDeep, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 20 }}>
                "{review.comment}"
              </p>

              {/* Author row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={review.name} />
                <div>
                  <div className="playfair" style={{ fontSize: 15, color: T.burgundyDeep }}>{review.name}</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, color: T.textMuted }}>
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

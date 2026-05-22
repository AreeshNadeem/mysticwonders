import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../lib/constants';
import Navbar from '../components/layout/Navbar';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

const PAYMENT_OPTIONS = [
  { id: 'cod', name: 'Cash on delivery', sub: 'pay when your order arrives' },
  { id: 'easypaisa', name: 'Easypaisa / JazzCash', sub: 'instant mobile transfer' },
  { id: 'bank', name: 'Bank transfer', sub: 'IBFT to our account' },
];

const FIELDS = [
  { key: 'name', label: 'Full name', placeholder: 'your full name' },
  { key: 'phone', label: 'WhatsApp number', placeholder: '+92 3XX XXXXXXX' },
  { key: 'city', label: 'City', placeholder: 'your city' },
  { key: 'address', label: 'Full delivery address', placeholder: 'house no, street, area' },
];

/* ── Decorative motifs (Subtle selection for Checkout) ────────── */
function Star({ x, y, size = 16, opacity = 0.12 }) {
  const s = size;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = s / 2;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(' ');
  return <polygon points={pts} fill={T.burgundy} opacity={opacity} />;
}

function Bow({ x, y, scale = 1, opacity = 0.12 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity} stroke={T.burgundy} strokeWidth="1" fill="none">
      <path d="M0,0 C-14,-10 -22,-4 -16,2 C-10,8 0,0 0,0 Z" />
      <path d="M0,0 C14,-10 22,-4 16,2 C10,8 0,0 0,0 Z" />
      <path d="M0,0 C-8,6 -16,12 -20,18" />
      <path d="M0,0 C8,6 16,12 20,18" />
      <circle cx="0" cy="1" r="2" fill={T.burgundy} opacity="0.2" />
    </g>
  );
}

function Heart({ x, y, size = 14, opacity = 0.08 }) {
  return (
    <path
      d={`M${x},${y + size * 0.3} 
         C${x},${y - size * 0.1} ${x - size * 0.5},${y - size * 0.5} ${x - size * 0.5},${y + size * 0.15}
         C${x - size * 0.5},${y + size * 0.55} ${x},${y + size * 0.85} ${x},${y + size * 0.85}
         C${x},${y + size * 0.85} ${x + size * 0.5},${y + size * 0.55} ${x + size * 0.5},${y + size * 0.15}
         C${x + size * 0.5},${y - size * 0.5} ${x},${y - size * 0.1} ${x},${y + size * 0.3} Z`}
      fill={T.burgundy}
      opacity={opacity}
    />
  );
}

function CheckoutMotifs() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 0 }} viewBox="0 0 1100 900" preserveAspectRatio="xMidYMid slice" fill="none">
      <Star x={80}  y={150} size={20} />
      <Star x={1020}y={200} size={16} />
      <Star x={950} y={750} size={18} />
      <Bow  x={120} y={450} scale={1.2} />
      <Bow  x={980} y={500} scale={0.9} />
      <Heart x={40}  y={800} size={20} />
      <Heart x={1060}y={50}  size={14} />
      <circle cx="50"  cy="50"   r="80"  stroke={T.burgundy} strokeWidth="0.4" opacity="0.08" />
      <circle cx="1050" cy="850"  r="120" stroke={T.burgundy} strokeWidth="0.3" opacity="0.07" />
    </svg>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);
  
  const delivery = 150;
  const total = subtotal + delivery;
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [payment, setPayment] = useState('cod');
  const [fields, setFields] = useState({ name: '', phone: '', city: '', address: '' });

  const placeOrder = async () => {
    setFormError('');
    if (items.length === 0) {
      setFormError('Your magic bag is empty! Add an item first.');
      return;
    }
    if (!fields.name || !fields.phone || !fields.city || !fields.address) {
      setFormError('Please fill out all delivery details to proceed.');
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    
    const orderData = {
      userId: user ? user.uid : 'guest',
      items,
      deliveryDetails: fields,
      paymentMethod: payment,
      subtotal,
      deliveryFee: delivery,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Update stock for each item
      for (const item of items) {
        try {
          const productRef = doc(db, 'products', String(item.id));
          await updateDoc(productRef, {
            stock: increment(-item.qty)
          });
        } catch (stockErr) {
          console.error(`Failed to update stock for item ${item.id}`, stockErr);
        }
      }

      clearCart();
      navigate(`/order/${docRef.id}`);
    } catch (e) {
      console.error("Error creating order", e);
      alert("Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="scroll-area" style={{ background: T.blushBg, paddingBottom: 140, position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      <CheckoutMotifs />

      <div className="content-wrap" style={{ marginTop: 40 }}>
        <div style={{ maxWidth: 1250, margin: '0 auto', width: '100%', padding: '0 20px' }}>
          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 0 40px' }}>
            {[{ n: '1', label: 'Bag', done: true }, { n: '2', label: 'Delivery', active: true }, { n: '3', label: 'Confirm', inactive: true }].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.inactive ? '#EDD0D6' : T.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'EB Garamond, serif', fontSize: 12, color: s.inactive ? T.textMuted : T.blushLight }}>{s.n}</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.08em', color: s.inactive ? T.textMuted : T.burgundy, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
                {i < 2 && <div style={{ width: 'clamp(40px, 10vw, 80px)', height: '0.5px', background: i === 0 ? T.burgundy : '#EDD0D6', margin: '0 8px', marginBottom: 20 }} />}

              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: 'clamp(40px, 8vw, 150px)' }}>
            {/* Left Column: Form */}
            <div>
              <div style={{ marginBottom: 30 }}>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 16 }}>✦ Delivery details</div>

                {FIELDS.map((f) => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>{f.label}</div>
                    <input className="field-input" placeholder={f.placeholder} value={fields[f.key]} onChange={(e) => setFields((fd) => ({ ...fd, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 30 }}>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 16 }}>✦ Payment method</div>
                {PAYMENT_OPTIONS.map((opt) => (
                  <div key={opt.id} className={`payment-option${payment === opt.id ? ' selected' : ''}`} onClick={() => setPayment(opt.id)}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${payment === opt.id ? T.blushLight : T.borderMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {payment === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.blushLight }} />}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, letterSpacing: '0.03em', color: payment === opt.id ? T.blushLight : T.textAccent }}>{opt.name}</div>
                      <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, color: payment === opt.id ? 'rgba(247,214,220,0.7)' : T.textMuted, fontStyle: 'italic', marginTop: 1 }}>{opt.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Summary */}
            <div>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.18em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 16 }}>✦ Your bag</div>
              <div style={{ background: '#fff', borderRadius: 20, border: '0.5px solid #EDD0D6', padding: 24, boxShadow: '0 10px 30px rgba(107, 26, 46, 0.03)' }}>
                {items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', fontFamily: 'EB Garamond, serif', color: T.textMuted, fontStyle: 'italic' }}>Your bag is empty</div>
                ) : items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 60, height: 60, borderRadius: 14, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                        <span style={{ opacity: 0.2, color: T.burgundy }}>✦</span>
                      </div>
                      <div>
                        <div className="playfair" style={{ fontStyle: 'italic', fontSize: 18, color: T.burgundyDeep, marginBottom: 2 }}>{item.name}</div>
                        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textMuted }}>qty: {item.qty}</div>
                      </div>
                    </div>
                    <div className="playfair" style={{ fontSize: 18, color: T.burgundy }}>Rs {item.price * item.qty}</div>
                  </div>

                ))}

                <div style={{ height: '0.5px', background: '#EDD0D6', margin: '20px 0' }} />

                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <input className="coupon-input" placeholder="Enter coupon code" />
                  <button style={{ background: 'transparent', border: `0.5px solid ${T.borderMuted}`, borderRadius: 12, padding: '11px 16px', fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.textAccent, cursor: 'pointer', whiteSpace: 'nowrap' }}>Apply</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted }}>Subtotal</span>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.burgundyDeep }}>Rs {subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted }}>Delivery</span>
                  <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.burgundyDeep }}>Rs {delivery}</span>
                </div>

                <div style={{ height: '0.5px', background: '#EDD0D6', margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="playfair" style={{ fontSize: 18, fontStyle: 'italic', color: T.burgundyDeep }}>Total</span>
                  <span className="playfair" style={{ fontSize: 24, color: T.burgundy }}>Rs {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky-bar">
        <div className="sticky-bar-inner">
          {formError && (
            <div style={{ padding: '12px 16px', background: '#FFEDF0', color: T.burgundyDeep, borderRadius: 12, marginBottom: 16, fontFamily: 'EB Garamond, serif', fontSize: 15, border: '0.5px solid #E8C4CC', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>✦</span> {formError}
            </div>
          )}
          <button className="btn-primary hover-scale" style={{ padding: '18px' }} onClick={placeOrder} disabled={submitting}>
            {submitting ? '✦ Processing ✦' : `✦   Place order — Rs ${total}`}
          </button>
          <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'EB Garamond, serif', fontSize: 12, color: T.textMuted, letterSpacing: '0.04em', fontStyle: 'italic' }}>Your details are safe with us ✦</div>
        </div>
      </div>
    </div>
  );
}

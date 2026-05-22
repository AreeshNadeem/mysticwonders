import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { T } from '../lib/constants';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/* ── Decorative motifs ─────────────────────────────────────── */
function Star({ x, y, size = 16, opacity = 0.18 }) {
  const s = size;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = s / 2;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(' ');
  return <polygon points={pts} fill={T.burgundy} opacity={opacity} />;
}

function Bow({ x, y, scale = 1, opacity = 0.18 }) {
  // Simple line-art bow as path
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity} stroke={T.burgundy} strokeWidth="1" fill="none">
      {/* Left loop */}
      <path d="M0,0 C-14,-10 -22,-4 -16,2 C-10,8 0,0 0,0 Z" />
      {/* Right loop */}
      <path d="M0,0 C14,-10 22,-4 16,2 C10,8 0,0 0,0 Z" />
      {/* Left tail */}
      <path d="M0,0 C-8,6 -16,12 -20,18" />
      {/* Right tail */}
      <path d="M0,0 C8,6 16,12 20,18" />
      {/* Centre knot */}
      <circle cx="0" cy="1" r="2.5" fill={T.burgundy} opacity="0.3" />
    </g>
  );
}

function Heart({ x, y, size = 14, opacity = 0.12 }) {
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

function MotifsBg() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
      viewBox="0 0 1100 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* ── Stars scattered ── */}
      <Star x={60}  y={80}  size={22} opacity={0.22} />
      <Star x={980} y={60}  size={14} opacity={0.15} />
      <Star x={1050}y={240} size={10} opacity={0.13} />
      <Star x={30}  y={400} size={18} opacity={0.18} />
      <Star x={1080}y={500} size={20} opacity={0.20} />
      <Star x={140} y={750} size={12} opacity={0.14} />
      <Star x={950} y={800} size={16} opacity={0.17} />
      <Star x={520} y={30}  size={10} opacity={0.12} />
      <Star x={400} y={870} size={14} opacity={0.15} />
      <Star x={700} y={860} size={8}  opacity={0.10} />
      <Star x={80}  y={600} size={8}  opacity={0.10} />

      {/* ── Ribbon bows ── */}
      <Bow x={90}  y={140} scale={1.4} opacity={0.20} />
      <Bow x={1020}y={130} scale={1.0} opacity={0.16} />
      <Bow x={40}  y={700} scale={0.8} opacity={0.15} />
      <Bow x={1060}y={680} scale={1.2} opacity={0.18} />
      <Bow x={280} y={50}  scale={0.7} opacity={0.13} />
      <Bow x={820} y={50}  scale={0.9} opacity={0.14} />
      <Bow x={550} y={880} scale={1.0} opacity={0.16} />

      {/* ── Floating hearts ── */}
      <Heart x={160} y={200} size={18} opacity={0.12} />
      <Heart x={940} y={300} size={14} opacity={0.10} />
      <Heart x={70}  y={520} size={22} opacity={0.09} />
      <Heart x={1040}y={420} size={10} opacity={0.11} />
      <Heart x={360} y={820} size={16} opacity={0.10} />
      <Heart x={760} y={810} size={12} opacity={0.09} />
      <Heart x={500} y={120} size={10} opacity={0.08} />

      {/* ── Circle halos ── */}
      <circle cx="100"  cy="100"  r="90"  stroke={T.burgundy} strokeWidth="0.5" opacity="0.10" />
      <circle cx="1000" cy="800"  r="130" stroke={T.burgundy} strokeWidth="0.4" opacity="0.09" />
      <circle cx="550"  cy="450"  r="320" stroke={T.burgundy} strokeWidth="0.3" opacity="0.06" />
      <circle cx="200"  cy="600"  r="70"  stroke={T.burgundy} strokeWidth="0.5" opacity="0.08" />
      <circle cx="900"  cy="150"  r="100" stroke={T.burgundy} strokeWidth="0.4" opacity="0.08" />

      {/* ── Curved line flourishes ── */}
      <path d="M0,200 Q150,120 280,240 Q420,360 320,480" stroke={T.burgundy} strokeWidth="0.6" opacity="0.08" />
      <path d="M1100,300 Q950,400 1020,550 Q1080,680 950,750" stroke={T.burgundy} strokeWidth="0.6" opacity="0.08" />
      <path d="M200,880 Q350,800 480,860 Q600,920 720,840" stroke={T.burgundy} strokeWidth="0.5" opacity="0.07" />
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        read: false,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scroll-area" style={{ background: T.blushBg, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      <MotifsBg />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 60px)' }}>
        <div style={{ width: '100%', maxWidth: 1060 }}>

          {/* Page header — centred */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 64px)' }}
          >
            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.25em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 14 }}>✦ &nbsp; get in touch &nbsp; ✦</div>
            <h1 className="playfair" style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontStyle: 'italic', color: T.burgundyDeep, lineHeight: 1.1, marginBottom: 18 }}>
              We love hearing<br />from <em style={{ color: T.burgundyMid }}>you</em>
            </h1>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, fontStyle: 'italic', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Have a question, want to collaborate, or just want to say hi? ✦
            </p>
            {/* Decorative divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 280, margin: '28px auto 0', opacity: 0.4 }}>
              <div style={{ flex: 1, height: 0.5, background: T.burgundy }} />
              <span style={{ fontSize: 14, color: T.burgundy }}>✦</span>
              <div style={{ flex: 1, height: 0.5, background: T.burgundy }} />
            </div>
          </motion.div>

          {/* Two-column: contact info + form */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(32px, 5vw, 56px)', alignItems: 'start' }}>

            {/* Left — Contact details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              style={{ paddingTop: 8 }}
            >
              <div style={{ display: 'grid', gap: 28 }}>
                {[
                  { icon: '✉', label: 'Email us', value: 'hello@mysticwonders.shop' },
                  { icon: '✦', label: 'WhatsApp', value: '+92 300 1234567' },
                  { icon: '◎', label: 'Instagram', value: '@mysticwonders.shop' },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', border: `0.5px solid ${T.blushBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: T.burgundy, flexShrink: 0, boxShadow: '0 4px 12px rgba(107,26,46,0.06)' }}>
                      {icon}
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 4 }}>{label}</div>
                      <div className="playfair" style={{ fontStyle: 'italic', fontSize: 19, color: T.burgundyDeep, lineHeight: 1.2 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Little note */}
              <div style={{ marginTop: 44, background: '#fff', borderRadius: 20, border: `0.5px solid ${T.blushBorder}`, padding: '22px 26px', boxShadow: '0 6px 18px rgba(107,26,46,0.04)' }}>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.16em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10 }}>✦ &nbsp; response time</div>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted, fontStyle: 'italic', lineHeight: 1.7 }}>
                  We typically respond within 24–48 hours. For quick questions, WhatsApp is the fastest! 🌸
                </p>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ background: '#fff', borderRadius: 28, padding: 'clamp(36px, 5vw, 52px)', border: `0.5px solid ${T.blushBorder}`, textAlign: 'center', boxShadow: '0 15px 40px rgba(107,26,46,0.06)' }}
                >
                  <div style={{ width: 80, height: 80, background: T.burgundy, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#fff' }}>✓</div>
                  <h2 className="playfair" style={{ fontSize: 32, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 14 }}>Message sent!</h2>
                  <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, lineHeight: 1.7, fontStyle: 'italic' }}>
                    Thank you for reaching out — we'll be in touch soon ✦
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ background: '#fff', padding: 'clamp(28px, 4vw, 44px)', borderRadius: 28, boxShadow: '0 15px 40px rgba(107,26,46,0.06)', border: `0.5px solid ${T.blushBorder}`, display: 'grid', gap: 22 }}
                >
                  <div>
                    <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, display: 'block', marginBottom: 10 }}>Full name</label>
                    <input
                      type="text" required placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ background: '#FFF7F8', border: 'none', padding: '14px 18px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, display: 'block', marginBottom: 10 }}>Email address</label>
                    <input
                      type="email" required placeholder="hello@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ background: '#FFF7F8', border: 'none', padding: '14px 18px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, display: 'block', marginBottom: 10 }}>Message</label>
                    <textarea
                      required placeholder="How can we help?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ background: '#FFF7F8', border: 'none', padding: '14px 18px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, minHeight: 150, resize: 'none', color: T.burgundyDeep, outline: 'none', lineHeight: 1.6 }}
                    />
                  </div>
                  <button
                    type="submit" className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '14px', fontSize: 16, borderRadius: 28, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Sending...' : '✦ \u00a0 Send message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

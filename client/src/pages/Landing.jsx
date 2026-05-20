import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { T, PRODUCTS } from '../lib/constants';
import useCartStore from '../store/cartStore';
import Navbar from '../components/layout/Navbar';

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};
const child = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="scroll-area" style={{ background: T.dark }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ minHeight: '80vh', background: T.dark, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* SVG motif */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 390 760" fill="none">
          <circle cx="360" cy="120" r="180" stroke="#6B1A2E" strokeWidth="0.5" opacity="0.25"/>
          <circle cx="30"  cy="500" r="140" stroke="#6B1A2E" strokeWidth="0.4" opacity="0.18"/>
          <circle cx="195" cy="380" r="260" stroke="#6B1A2E" strokeWidth="0.3" opacity="0.12"/>
          <path d="M320 90 L324 104 L338 104 L327 112 L331 126 L320 118 L309 126 L313 112 L302 104 L316 104 Z" fill="#6B1A2E" opacity="0.3"/>
          <path d="M60 160 L63 170 L73 170 L65 176 L68 186 L60 180 L52 186 L55 176 L47 170 L57 170 Z"         fill="#6B1A2E" opacity="0.25"/>
        </svg>

        <div className="hero-content" style={{ textAlign: 'center', width: '100%' }}>
          <motion.div variants={stagger} initial="initial" animate="animate" style={{ position: 'relative', zIndex: 2, padding: '0 32px' }}>
            <motion.div variants={child} style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.25em', color: '#C47080', textTransform: 'uppercase', marginBottom: 20 }}>
              ✦ &nbsp; handcrafted in pakistan &nbsp; ✦
            </motion.div>
            <motion.h1 variants={child} className="playfair hero-h1" style={{ fontSize: 'clamp(32px, 7vw, 72px)', color: '#F7D6DC', lineHeight: 1.1, marginBottom: 12, fontWeight: 400 }}>
              Adorn yourself<br />in <em style={{ color: '#E8B4BF' }}>wonders</em>
            </motion.h1>
            <motion.p variants={child} style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: '#C47080', fontStyle: 'italic', margin: '20px 0 32px' }}>
              beaded jewellery, made with love
            </motion.p>
            <motion.div variants={child} style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '14px 40px' }} onClick={() => navigate('/shop')}>Shop now</button>
              <button
                style={{ background: 'transparent', color: '#D4A0AC', border: '0.5px solid #6B1A2E', padding: '14px 32px', borderRadius: 30, fontFamily: 'EB Garamond, serif', fontSize: 16, letterSpacing: '0.04em', cursor: 'pointer' }}
                onClick={() => navigate('/about')}
              >our story ↗</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured products ── */}

      <section style={{ background: T.blushBg, padding: '80px 24px' }}>
        <div className="content-wrap">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 8 }}>✦ &nbsp; new arrivals</div>
            <h2 className="playfair section-h2" style={{ fontStyle: 'italic', color: T.burgundyDeep }}>Latest wonders</h2>
          </div>
          <div className="divider"><div className="divider-line"/><span className="divider-star">✦</span><div className="divider-line"/></div>
          <div className="featured-grid">
            {PRODUCTS.slice(0, 4).map((p) => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/shop/${p.id}`)}>
                <div style={{ width: '100%', aspectRatio: 1, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, position: 'relative' }}>
                  <div style={{ opacity: 0.2, fontSize: 60, color: T.burgundy }}>✦</div>
                  {p.badge && !p.soldOut && <div className="badge">{p.badge}</div>}
                </div>

                <div style={{ padding: '16px' }}>
                  <div className="playfair" style={{ fontStyle: 'italic', fontSize: 16, color: T.burgundyDeep, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.textMuted, marginBottom: 8 }}>{p.sub}</div>
                  <div className="playfair" style={{ fontSize: 18, color: T.burgundy }}>Rs {p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand strip ── */}
      <section style={{ background: T.burgundy, padding: '80px 32px', textAlign: 'center' }}>
        <div className="content-wrap">
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.2em', color: '#C47080', textTransform: 'uppercase', marginBottom: 16 }}>✦ &nbsp; the maker &nbsp; ✦</div>
          <h2 className="playfair section-h2" style={{ fontStyle: 'italic', color: '#F7D6DC', lineHeight: 1.3, marginBottom: 20 }}>Every piece carries<br />a little magic</h2>
          <p style={{ maxWidth: 600, margin: '0 auto 32px', fontFamily: 'EB Garamond, serif', fontSize: 18, color: '#D4A0AC', lineHeight: 1.8 }}>
            mystic wonders is a one-woman jewellery brand based in Pakistan — each charm, bead, and knot placed with care and intention.
          </p>
          <button onClick={() => navigate('/about')} className="btn-outline" style={{ width: 'auto', display: 'inline-block', padding: '12px 32px', color: '#F7D6DC', borderColor: '#F7D6DC', background: 'transparent' }}>
            read the story ↗
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: T.darkDeep, padding: '80px 24px 100px', textAlign: 'center' }}>
        <div className="content-wrap">
          <div className="playfair" style={{ fontStyle: 'italic', fontSize: 28, color: '#F7D6DC', marginBottom: 16 }}>mystic wonders</div>
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: '#C47080', fontStyle: 'italic', marginBottom: 32 }}>the cutest jewellery shop ✦ delivering all across pakistan</div>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px 32px', marginBottom: 32 }}>
            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/shop')}>shop</span>
            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/about')}>about</span>
            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/contact')}>contact</span>
            <a href="https://www.instagram.com/mysticwonders.shop?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', textDecoration: 'none' }}>instagram</a>
          </div>
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, color: '#6B3040', letterSpacing: '0.04em' }}>© 2026 mysticwonders.shop</div>
        </div>
      </footer>

    </div>
  );
}

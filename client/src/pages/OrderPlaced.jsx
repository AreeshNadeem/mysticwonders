import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { T } from '../lib/constants';

const PARTICLES = ['✦', '✧', '⊹', '✴', '˚', '₊'];

const TRACKER_STEPS = [
  { icon: '✓', label: 'Order\nplaced',  done: true  },
  { line: true, done: true  },
  { icon: '✓', label: 'Being\nmade',    done: true  },
  { line: true, done: false },
  { icon: '◌', label: 'Packed &\nshipped', pending: true },
  { line: true, done: false },
  { icon: '□', label: 'With\nyou',     pending: true },
];

export default function OrderPlaced() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const orderNum  = id || 'MW-2026-0847';

  return (
    <div className="scroll-area" style={{ background: T.dark }}>
      <Navbar />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${10 + (i * 11) % 80}%`,
          animationDuration: `${4 + (i % 4)}s`,
          animationDelay: `${(i * 0.5) % 4}s`,
          fontSize: `${12 + (i % 3) * 4}px`,
          color: '#F7D6DC',
          opacity: 0.4
        }}>
          {PARTICLES[i % PARTICLES.length]}
        </div>
      ))}

      {/* Celebration hero */}
      <div style={{ minHeight: '55vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: T.burgundy, border: '2px solid rgba(247,214,220,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, margin: '0 auto 28px', animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both', position: 'relative' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F7D6DC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '0.5px solid rgba(196,112,128,0.3)', animation: 'ringPulse 2s ease-in-out infinite' }}/>
        </div>
        <div className="fade-up-1" style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.22em', color: '#C47080', textTransform: 'uppercase', marginBottom: 16 }}>✦ &nbsp; order confirmed &nbsp; ✦</div>
        <h1 className="fade-up-2 playfair hero-h1" style={{ fontStyle: 'italic', color: '#F7D6DC', lineHeight: 1.15, marginBottom: 18 }}>Your wonder<br/>is on its way</h1>
        <p className="fade-up-3" style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: '#C47080', fontStyle: 'italic', lineHeight: 1.7 }}>we're already tying the knots<br/>just for you ✦</p>
      </div>

      {/* Order card */}
      <div className="content-wrap" style={{ padding: '0 20px 80px', position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <div className="fade-up-4 shadow-xl" style={{ background: T.blushBg, borderRadius: 24, border: '0.5px solid #EDD0D6', overflow: 'hidden', marginBottom: 30 }}>
            <div style={{ background: T.burgundy, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.14em', color: 'rgba(247,214,220,0.7)', textTransform: 'uppercase' }}>Order number</div>
                <div className="playfair" style={{ fontSize: 16, fontStyle: 'italic', color: '#F7D6DC', marginTop: 4 }}>#{orderNum}</div>
              </div>
              <div style={{ background: 'rgba(247,214,220,0.15)', border: '0.5px solid rgba(247,214,220,0.3)', color: '#F7D6DC', borderRadius: 20, padding: '6px 16px', fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.06em' }}>✦ Confirmed</div>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* Delivery info */}
              <div className="info-card" style={{ background: 'rgba(255,255,255,0.4)', border: 'none', marginBottom: 24 }}>
                {[
                  { icon: '✦', label: 'Delivering to',       value: 'Your address on file' },
                  { icon: '✦', label: 'WhatsApp updates on', value: 'Your number on file' },
                  { icon: '✦', label: 'Payment',              value: 'Cash on delivery' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5E0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: T.burgundy, flexShrink: 0, marginTop: 1 }}>{row.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.14em', color: T.textMuted, textTransform: 'uppercase', marginBottom: 3 }}>{row.label}</div>
                      <div className="playfair" style={{ fontStyle: 'italic', fontSize: 16, color: T.burgundyDeep }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order tracker */}
              <div style={{ background: '#fff', borderRadius: 20, border: '0.5px solid #EDD0D6', padding: 24, marginBottom: 24 }}>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.18em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 20 }}>✦ Order journey</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  {TRACKER_STEPS.map((s, i) =>
                    s.line !== undefined ? (
                      <div key={i} style={{ flex: 1, height: '1.5px', background: s.done ? T.burgundy : '#EDD0D6', margin: '0 8px', marginBottom: 24 }}/>
                    ) : (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                        <div className={`tracker-dot${s.pending ? ' pending' : ''}`} style={{ width: 32, height: 32, fontSize: 12, color: s.done ? '#fff' : T.burgundy }}>{s.icon}</div>
                        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, color: T.textMuted, textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1.4, whiteSpace: 'pre' }}>{s.label}</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* WhatsApp note */}
              <div style={{ background: '#FDF0F3', borderRadius: 16, border: '0.5px solid #EDD0D6', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F7D6DC', fontSize: 14, flexShrink: 0 }}>✦</div>
                <div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.burgundy, marginBottom: 4 }}>WhatsApp updates</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted, lineHeight: 1.6 }}>You'll get a message when your order is packed and again when it's shipped — no guessing required.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <button className="btn-primary" onClick={() => navigate('/shop')}>✦ &nbsp; Keep shopping</button>
            <button className="btn-outline" style={{ background: 'transparent', color: '#F7D6DC', borderColor: '#F7D6DC' }}>✦ &nbsp; Share wonders</button>
          </div>
        </div>
      </div>
    </div>
  );
}

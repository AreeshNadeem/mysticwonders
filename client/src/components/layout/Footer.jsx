import { useNavigate } from 'react-router-dom';
import { T } from '../../lib/constants';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/* ── Decorative motifs (Subtle selection for Dark Footer) ────────── */
function Star({ x, y, size = 16, opacity = 0.05 }) {
  const s = size;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = s / 2;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(' ');
  return <polygon points={pts} fill="#F7D6DC" opacity={opacity} />;
}

function Bow({ x, y, scale = 1, opacity = 0.05 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity} stroke="#F7D6DC" strokeWidth="1.2" fill="none">
      <path d="M0,0 C-14,-10 -22,-4 -16,2 C-10,8 0,0 0,0 Z" />
      <path d="M0,0 C14,-10 22,-4 16,2 C10,8 0,0 0,0 Z" />
      <path d="M0,0 C-8,6 -16,12 -20,18" />
      <path d="M0,0 C8,6 16,12 20,18" />
      <circle cx="0" cy="1" r="2" fill="#F7D6DC" opacity="0.1" />
    </g>
  );
}

function FooterMotifs() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible', zIndex: 0 }} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" fill="none">
      <Star x={100}  y={100} size={24} />
      <Star x={1300} y={80}  size={18} />
      <Star x={700}  y={320} size={14} />
      <Bow  x={1250} y={300} scale={1.4} />
      <Bow  x={80}   y={320} scale={1.1} />
      <circle cx="1400" cy="50"  r="200" stroke="#6B1A2E" strokeWidth="0.5" opacity="0.08" />
      <circle cx="0"    cy="400" r="150" stroke="#6B1A2E" strokeWidth="0.4" opacity="0.06" />
    </svg>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const snap = await getDocs(collection(db, 'newsletter'));
      const numericIds = snap.docs.map(d => Number(d.id)).filter(id => !isNaN(id));
      const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      const nextIdStr = String(nextId);

      await setDoc(doc(db, 'newsletter', nextIdStr), {
        email,
        subscribedAt: serverTimestamp()
      });
      alert(`✦ magic news heading your way at ${email}!`);
      setEmail('');
    } catch (err) {
      console.error(err);
      alert("Error subscribing.");
    }
  };

  return (
    <footer style={{ background: T.darkDeep, padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
      <FooterMotifs />

      <div className="content-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px 40px' }}>
          
          {/* Left: Branding */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="playfair" style={{ fontStyle: 'italic', fontSize: 42, color: '#F7D6DC', marginBottom: 16, cursor: 'pointer' }} onClick={() => navigate('/')}>
              mystic wonders
            </div>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: '#C47080', fontStyle: 'italic', maxWidth: 300, lineHeight: 1.6 }}>
              the cutest jewellery shop ✦ delivering all across pakistan. every piece tells a story of magic.
            </p>
          </div>

          {/* Right: Links & Newsletter */}
          <div style={{ flex: '2 1 500px', display: 'flex', flexWrap: 'wrap', gap: '40px 60px', justifyContent: 'flex-end' }}>
            
            {/* Link Column 1 */}
            <div>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, letterSpacing: '0.2em', color: '#A66070', textTransform: 'uppercase', marginBottom: 24 }}>Explore</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {['Shop', 'About', 'Contact'].map(link => (
                  <span 
                    key={link} 
                    onClick={() => navigate(`/${link.toLowerCase() === 'shop' ? 'shop' : link.toLowerCase()}`)} 
                    style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: '#D4A0AC', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.target.style.color = '#F7D6DC'}
                    onMouseOut={(e) => e.target.style.color = '#D4A0AC'}
                  >
                    {link}
                  </span>
                ))}
              </div>
            </div>

            {/* Link Column 2 */}
            <div>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, letterSpacing: '0.2em', color: '#A66070', textTransform: 'uppercase', marginBottom: 24 }}>Social</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <a href="https://www.instagram.com/mysticwonders.shop" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: '#D4A0AC', textDecoration: 'none' }}>Instagram</a>
                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: '#D4A0AC' }}>TikTok</span>
                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: '#D4A0AC' }}>Pinterest</span>
              </div>
            </div>

            {/* Newsletter Column */}
            <div style={{ maxWidth: 320 }}>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, letterSpacing: '0.2em', color: '#A66070', textTransform: 'uppercase', marginBottom: 24 }}>Stay in the magic</div>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: '#A66070', marginBottom: 20, fontStyle: 'italic' }}>
                subscribe to get first access to new drops & special wonders ✦
              </p>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email address" 
                  style={{ background: 'rgba(107, 26, 46, 0.2)', border: '0.5px solid #A66070', borderRadius: 12, padding: '10px 16px', color: '#F7D6DC', fontSize: 14, fontFamily: 'EB Garamond, serif', flex: 1, outline: 'none' }}
                />
                <button type="submit" style={{ background: '#6B1A2E', color: '#F7D6DC', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 13, fontFamily: 'EB Garamond, serif', cursor: 'pointer' }}>
                  Join
                </button>
              </form>
            </div>

          </div>
        </div>

        <div style={{ marginTop: 80, paddingTop: 32, borderTop: '0.5px solid rgba(137, 30, 56, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: '#A66070' }}>
            © 2026 mysticwonders.shop · made with love by Areesh Nadeem
          </div>
          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: '#A66070', fontStyle: 'italic' }}>
            Handcrafted with magic in Pakistan ✦
          </div>
        </div>
      </div>
    </footer>
  );
}

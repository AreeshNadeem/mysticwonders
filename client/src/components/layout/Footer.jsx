import { useNavigate } from 'react-router-dom';
import { T } from '../../lib/constants';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
      {/* Subtle Background Motif */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '300px', color: '#6B1A2E', opacity: 0.05, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>✦</div>

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

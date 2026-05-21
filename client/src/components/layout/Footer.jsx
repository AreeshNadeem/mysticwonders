import { useNavigate } from 'react-router-dom';
import { T } from '../../lib/constants';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{ background: T.darkDeep, padding: '60px 24px 80px', textAlign: 'center' }}>
      <div className="content-wrap">
        <div className="playfair" style={{ fontStyle: 'italic', fontSize: 28, color: '#F7D6DC', marginBottom: 16 }}>mystic wonders</div>
        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: '#C47080', fontStyle: 'italic', marginBottom: 32 }}>the cutest jewellery shop ✦ delivering all across pakistan</div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px 32px', marginBottom: 32 }}>
          <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/shop')}>shop</span>
          <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/about')}>about</span>
          <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/contact')}>contact</span>
          <a href="https://www.instagram.com/mysticwonders.shop" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: '#D4A0AC', textTransform: 'uppercase', textDecoration: 'none' }}>instagram</a>
        </div>
        
        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: '#F7D6DC', fontStyle: 'italic', marginBottom: 16 }}>
          made with love by Areesh Nadeem
        </div>

        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, color: '#6B3040', letterSpacing: '0.04em' }}>© 2026 mysticwonders.shop</div>
      </div>
    </footer>
  );
}

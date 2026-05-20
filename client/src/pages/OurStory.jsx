import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { T } from '../lib/constants';
import BrandMotif from '../components/ui/BrandMotif';

const STORY_SECTIONS = [
  { title: 'How it began', body: 'Mystic wonders started in 2023, in a small room in Pakistan with a handful of beads, a roll of thread, and a feeling that something beautiful was waiting to be made. What started as a creative outlet quietly became something bigger — a brand built entirely by hand.' },
  { title: 'The philosophy', body: 'Every piece is made with intention. Whether it is a keychain you reach for every day or a necklace for a special occasion — we believe small things carry big meaning. Each charm, knot, and bead is placed with care.' },
  { title: 'Made in Pakistan', body: 'We are proudly Pakistani, and we deliver across the country. Every order is wrapped and shipped with love — directly from our hands to yours.' },
  { title: 'Custom orders', body: 'Something in mind? We do custom orders. A gift for a best friend, a colour to match an outfit, a charm with meaning — just DM us on Instagram and lets create something together.' },
];

const VALUES = [
  { icon: '✦', label: 'Made with love', val: 'Every. single. piece.' },
  { icon: '◌', label: 'Based in Pakistan', val: 'Delivering nationwide' },
  { icon: '✧', label: 'Handcrafted', val: 'No mass production' },
  { icon: '□', label: 'Gifting-ready', val: 'Beautiful packaging' },
];


export default function OurStory() {
  const navigate = useNavigate();

  return (
    <div className="scroll-area" style={{ background: T.dark }}>
      <Navbar />

      {/* Hero - Fully Centered */}
      <div style={{ background: T.dark, padding: '100px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BrandMotif dark />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000 }}>
          <div className="fade-up" style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.22em', color: '#C47080', textTransform: 'uppercase', marginBottom: 24 }}>✦ &nbsp; the maker &nbsp; ✦</div>
          <h1 className="playfair fade-up-1 hero-h1" style={{ fontStyle: 'italic', fontSize: 'clamp(40px, 8vw, 84px)', color: '#F7D6DC', lineHeight: 1.1, marginBottom: 24 }}>Every knot<br />tells a story</h1>
          <p className="fade-up-2" style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(18px, 3vw, 24px)', color: '#C47080', fontStyle: 'italic', lineHeight: 1.7 }}>a one-woman brand, built with<br />beads and a whole lot of love</p>
        </div>
      </div>


      {/* Story body */}
      <div style={{ background: T.blushBg, padding: '100px 28px' }}>
        <div className="content-wrap">
          <div className="page-container">
            <div className="divider" style={{ margin: '0 0 80px' }}><div className="divider-line" /><span className="divider-star">✦</span><div className="divider-line" /></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 80, marginBottom: 100 }}>
              {STORY_SECTIONS.map((s) => (
                <div key={s.title}>
                  <div className="playfair" style={{ fontSize: 26, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 18 }}>{s.title}</div>
                  <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, lineHeight: 1.9 }}>{s.body}</p>
                </div>
              ))}
            </div>

            {/* Values grid */}
            <div className="values-grid">
              {VALUES.map((v) => (
                <div key={v.label} style={{ background: '#fff', border: '0.5px solid #EDD0D6', borderRadius: 24, padding: '40px 24px', textAlign: 'center', boxShadow: '0 15px 35px rgba(107, 26, 46, 0.05)' }}>
                  <span style={{ fontSize: 36, marginBottom: 16, display: 'block' }}>{v.icon}</span>
                  <div className="playfair" style={{ fontSize: 18, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 6 }}>{v.label}</div>
                  <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.textMuted }}>{v.val}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 100 }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '18px 60px' }} onClick={() => navigate('/shop')}>✦ &nbsp; Shop the collection</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

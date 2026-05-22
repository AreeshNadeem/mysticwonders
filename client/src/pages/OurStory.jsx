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

const iconPaths = {
  bloom: {
    label: "Made with love",
    sub: "Every. single. piece.",
    svg: (
      <svg width="56" height="56" viewBox="-32 -32 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 C8,-10 10,-22 0,-28 C-10,-22 -8,-10 0,0 Z" stroke="#6B1A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0,0 C8,10 10,22 0,28 C-10,22 -8,10 0,0 Z" stroke="#6B1A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0,0 C-10,-8 -22,-10 -28,0 C-22,10 -10,8 0,0 Z" stroke="#6B1A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0,0 C10,-8 22,-10 28,0 C22,10 10,8 0,0 Z" stroke="#6B1A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="0" cy="0" r="4" fill="none" stroke="#6B1A2E" strokeWidth="1.2"/>
        <circle cx="0" cy="0" r="1.5" fill="#6B1A2E"/>
      </svg>
    ),
  },
  pin: {
    label: "Based in Pakistan",
    sub: "Delivering nationwide",
    svg: (
      <svg width="56" height="56" viewBox="-28 -32 56 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,-28 C-16,-28 -26,-18 -26,-6 C-26,10 0,28 0,28 C0,28 26,10 26,-6 C26,-18 16,-28 0,-28 Z" stroke="#6B1A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="0" cy="-6" r="6" stroke="#6B1A2E" strokeWidth="1.2"/>
        <circle cx="0" cy="-6" r="1.5" fill="#6B1A2E"/>
      </svg>
    ),
  },
  spool: {
    label: "Handcrafted",
    sub: "No mass production",
    svg: (
      <svg width="56" height="56" viewBox="-30 -30 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="-22" y="-24" width="44" height="8" rx="4" stroke="#6B1A2E" strokeWidth="1.5"/>
        <rect x="-22" y="16" width="44" height="8" rx="4" stroke="#6B1A2E" strokeWidth="1.5"/>
        <rect x="-12" y="-16" width="24" height="32" stroke="#6B1A2E" strokeWidth="1.3"/>
        <path d="M-12,-8 L12,-8" stroke="#C47080" strokeWidth="1" opacity="0.6"/>
        <path d="M-12,0 L12,0"   stroke="#C47080" strokeWidth="1" opacity="0.6"/>
        <path d="M-12,8 L12,8"   stroke="#C47080" strokeWidth="1" opacity="0.6"/>
        <line x1="0" y1="-16" x2="0" y2="-28" stroke="#6B1A2E" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="0" cy="-24" r="1.5" stroke="#6B1A2E" fill="white" strokeWidth="1"/>
      </svg>
    ),
  },
  giftbox: {
    label: "Gifting-ready",
    sub: "Beautiful packaging",
    svg: (
      <svg width="56" height="56" viewBox="-28 -30 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="-20" y="-2" width="40" height="26" rx="2" stroke="#6B1A2E" strokeWidth="1.5"/>
        <rect x="-22" y="-10" width="44" height="8" rx="2" stroke="#6B1A2E" strokeWidth="1.5"/>
        <path d="M0,-10 L0,24" stroke="#C47080" strokeWidth="1.2" opacity="0.5"/>
        <path d="M0,-10 C-5,-18 -14,-18 -12,-10" stroke="#6B1A2E" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M0,-10 C5,-18 14,-18 12,-10"  stroke="#6B1A2E" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="0" cy="-10" r="2.5" fill="#6B1A2E"/>
      </svg>
    ),
  },
};

const cards = [iconPaths.bloom, iconPaths.pin, iconPaths.spool, iconPaths.giftbox];

export default function OurStory() {
  const navigate = useNavigate();

  return (
    <div className="scroll-area" style={{ background: T.dark }}>
      <Navbar />

      {/* Hero - Fully Centered */}
      <div style={{ background: T.dark, padding: '100px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BrandMotif dark />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000 }}>
          <div className="fade-up" style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.22em', color: '#C47080', textTransform: 'uppercase', marginBottom: 24 }}>✦ &nbsp; The maker &nbsp; ✦</div>
          <h1 className="playfair fade-up-1 hero-h1" style={{ fontStyle: 'italic', fontSize: 'clamp(40px, 8vw, 84px)', color: '#F7D6DC', lineHeight: 1.1, marginBottom: 24 }}>Every knot<br />tells a story</h1>
          <p className="fade-up-2" style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(18px, 3vw, 24px)', color: '#C47080', fontStyle: 'italic', lineHeight: 1.7 }}>A one-woman brand, built with<br />beads and a whole lot of love</p>
        </div>
      </div>


      {/* Story body */}
      <div style={{ background: T.blushBg, padding: '100px 28px', paddingBottom: 120 }}>
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

            {/* Values grid - Forced single line on desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {cards.map((v) => (
                <div 
                  key={v.label} 
                  className="hover-card"
                  style={{ background: '#fff', border: '0.5px solid #EDD0D6', borderRadius: 24, padding: 'clamp(20px, 3vw, 40px) 16px', textAlign: 'center', boxShadow: '0 15px 35px rgba(107, 26, 46, 0.05)', transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
                >
                  <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {v.svg}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div className="playfair" style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', fontStyle: 'italic', color: T.burgundyDeep, lineHeight: 1.2 }}>{v.label}</div>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(11px, 1.4vw, 14px)', color: T.textMuted }}>{v.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 100 }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/shop')}>✦ &nbsp; Shop the collection</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

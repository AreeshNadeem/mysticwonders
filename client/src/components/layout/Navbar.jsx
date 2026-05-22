import { useNavigate, useLocation } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { PRODUCTS, T } from '../../lib/constants';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { user } = useAuthStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  const isHome = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/track' || location.pathname.startsWith('/order');

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sub.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Close search on escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsSearchOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <nav className={`navbar-container ${isHome ? 'is-home' : 'is-page'}`} style={{ position: 'relative', zIndex: 1000 }}>
      <CartDrawer />
      
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(18, 4, 8, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1001 }}
            />
            <motion.div 
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#fff', padding: '24px 20px 32px', zIndex: 1002, borderBottom: `1px solid ${T.blushBorder}`, boxShadow: '0 20px 40px rgba(107, 26, 46, 0.1)' }}
            >
              <div className="content-wrap" style={{ maxWidth: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: searchQuery.length > 0 ? 24 : 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.burgundy} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for magic... (e.g. necklace, keychain)"
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 'clamp(17px, 3vw, 22px)', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', outline: 'none', color: T.burgundyDeep }}
                  />
                  <button onClick={() => setIsSearchOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: T.textMuted, cursor: 'pointer', padding: 8 }}>×</button>
                </div>

                {searchResults.length > 0 && (
                  <div className="search-results fade-up">
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, letterSpacing: '0.15em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 20 }}>Found {searchResults.length} wonders</div>
                    <div style={{ display: 'grid', gap: 16 }}>
                      {searchResults.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => { navigate(`/shop/${p.id}`); setIsSearchOpen(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 12, borderRadius: 16, cursor: 'pointer', transition: 'background 0.2s', border: '0.5px solid transparent' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#FFF7F8'; e.currentTarget.style.borderColor = '#EDD0D6'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                        >
                          <div style={{ width: 60, height: 60, borderRadius: 12, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>✦</div>
                          <div style={{ flex: 1 }}>
                            <div className="playfair" style={{ fontSize: 18, fontStyle: 'italic', color: T.burgundyDeep }}>{p.name}</div>
                            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.textMuted }}>{p.sub}</div>
                          </div>
                          <div className="playfair" style={{ fontSize: 18, color: T.burgundy }}>Rs {p.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'EB Garamond, serif', color: T.textMuted, fontStyle: 'italic', fontSize: 18 }}>
                    no wonders found for "{searchQuery}"... maybe try something else? ✦
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Section */}
      <div className="navbar-top">
        <div className="nav-icons-left">
          <button className="nav-icon" onClick={() => setIsSearchOpen(true)} title="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button className="nav-icon" onClick={() => navigate('/track')} title="Track Order">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </button>
        </div>

        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          mystic wonders
        </div>

        <div className="nav-icons-right">
          <button className="nav-icon" onClick={() => navigate('/wishlist')} title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"/></svg>
          </button>
          <button className="nav-icon" onClick={() => navigate(user ? '/profile' : '/login')} title={user ? "Profile" : "Account"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <div className="cart-icon-container">
            <button className="nav-icon" onClick={toggleCart} title="Shopping Bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </button>
            {totalItems > 0 && (
              <motion.span 
                key={totalItems} 
                initial={{ scale: 0.5, y: 10 }} 
                animate={{ scale: 1, y: 0 }} 
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="cart-count-badge"
              >
                {totalItems}
              </motion.span>
            )}
          </div>
        </div>
      </div>


      {/* Bottom Section - Links */}
      <div className="navbar-bottom sticky">
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('/shop')}>Shop</span>
          <span className="nav-link" onClick={() => navigate('/about')}>About</span>
          <span className="nav-link" onClick={() => navigate('/contact')}>Contact Us</span>
        </div>
      </div>
    </nav>
  );
}

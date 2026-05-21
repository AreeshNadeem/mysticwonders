import { useNavigate, useLocation } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const { user } = useAuthStore();

  const isHome = location.pathname === '/' || location.pathname === '/about' || location.pathname.startsWith('/order');

  return (
    <nav className={`navbar-container ${isHome ? 'is-home' : 'is-page'}`}>

      {/* Top Section */}
      <div className="navbar-top">
        <div className="nav-icons-left">
          <button className="nav-icon" onClick={() => navigate('/shop')} title="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
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
            <button className="nav-icon" onClick={() => navigate('/checkout')} title="Shopping Bag">
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

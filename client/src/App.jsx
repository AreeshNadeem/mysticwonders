import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from './store/authStore';
 
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import Landing     from './pages/Landing';
import Shop        from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout    from './pages/Checkout';
import OrderPlaced from './pages/OrderPlaced';
import Wishlist    from './pages/Wishlist';
import Login       from './pages/Login';
import Admin       from './pages/Admin';
import OurStory    from './pages/OurStory';
import Contact     from './pages/Contact';
import Profile     from './pages/Profile';
import TrackOrder  from './pages/TrackOrder';
import Footer      from './components/layout/Footer';


const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/shop"       element={<PageWrapper><Shop /></PageWrapper>} />
        <Route path="/shop/:id"   element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/checkout"   element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/order/:id"  element={<PageWrapper><OrderPlaced /></PageWrapper>} />
        <Route path="/wishlist"   element={<PageWrapper><Wishlist /></PageWrapper>} />
        <Route path="/login"      element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/admin"      element={<PageWrapper><Admin /></PageWrapper>} />
        <Route path="/profile"    element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/about"      element={<PageWrapper><OurStory /></PageWrapper>} />
        <Route path="/contact"    element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/track"      element={<PageWrapper><TrackOrder /></PageWrapper>} />
        {/* Catch-all → Landing */}

        <Route path="*"           element={<PageWrapper><Landing /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF8F6', color: '#6B1A2E', fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 20 }}>
        awakening wonders...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="mw-root">
        <ScrollToTop />
        <AnimatedRoutes />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

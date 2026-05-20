import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Landing     from './pages/Landing';
import Shop        from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout    from './pages/Checkout';
import OrderPlaced from './pages/OrderPlaced';
import Wishlist    from './pages/Wishlist';
import Login       from './pages/Login';
import OurStory    from './pages/OurStory';
import Contact     from './pages/Contact';


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
        <Route path="/about"      element={<PageWrapper><OurStory /></PageWrapper>} />
        <Route path="/contact"    element={<PageWrapper><Contact /></PageWrapper>} />
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
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="mw-root">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

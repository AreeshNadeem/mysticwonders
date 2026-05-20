import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '../lib/constants';
import BrandMotif from '../components/ui/BrandMotif';
import Navbar from '../components/layout/Navbar';

export default function Login() {
  const [tab, setTab] = useState('signin');

  return (
    <div className="scroll-area" style={{ background: T.blushBg, minHeight: '100vh' }}>
      <Navbar />
      
      <div className="content-wrap" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 80, alignItems: 'center', width: '100%', maxWidth: 1100 }}>
          
          {/* Brand/Hero Section */}
          <div className="fade-up" style={{ textAlign: 'left' }}>
            <BrandMotif style={{ margin: '0 0 32px 0' }} />
            <div className="playfair" style={{ fontStyle: 'italic', fontSize: 26, color: T.burgundyDeep, letterSpacing: '0.02em', marginBottom: 12 }}>mystic wonders</div>
            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, letterSpacing: '0.18em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 32 }}>✦ handcrafted jewellery</div>
            <h1 className="playfair" style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontStyle: 'italic', color: T.burgundyDeep, lineHeight: 1.1, marginBottom: 24 }}>Welcome<br />back</h1>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 20, color: T.textMuted, fontStyle: 'italic', lineHeight: 1.6 }}>sign in to your little corner ✦</p>
          </div>

          {/* Form Card */}
          <div className="fade-up-1" style={{ background: '#fff', borderRadius: 28, padding: '50px', boxShadow: '0 15px 40px rgba(107, 26, 46, 0.05)', position: 'relative', overflow: 'hiddenborder: \'0.5px solid #EDD0D6\'', border: '0.5px solid #EDD0D6' }}>
            
            <div className="playfair" style={{ fontSize: 32, fontStyle: 'italic', color: T.burgundyDeep, textAlign: 'center', marginBottom: 12 }}>
              {tab === 'signin' ? 'Sign In' : 'Sign Up'}
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted, fontStyle: 'italic', marginBottom: 40 }}>
              Please fill in your details below:
            </div>

            <AnimatePresence mode="wait">
              {tab === 'signin' ? (
                <motion.div key="signin" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <div style={{ display: 'grid', gap: 20, marginBottom: 32 }}>
                    <div>
                      <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Email address</label>
                      <input 
                        type="email" 
                        placeholder="hello@example.com" 
                        style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: 28, fontSize: 17 }}>
                    ✦ &nbsp; Sign In
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted }}>
                    Don't have an account? <span onClick={() => setTab('signup')} style={{ color: T.burgundyDeep, cursor: 'pointer', borderBottom: `1px solid ${T.burgundy}` }}>Create Account</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div style={{ display: 'grid', gap: 20, marginBottom: 32 }}>
                    <div>
                      <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Full name</label>
                      <input 
                        type="text" 
                        placeholder="your full name" 
                        style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Email address</label>
                      <input 
                        type="email" 
                        placeholder="hello@example.com" 
                        style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: 28, fontSize: 17 }}>
                    ✦ &nbsp; Create Account
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted }}>
                    Already have an account? <span onClick={() => setTab('signin')} style={{ color: T.burgundyDeep, cursor: 'pointer', borderBottom: `1px solid ${T.burgundy}` }}>Log In</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

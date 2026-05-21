import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '../lib/constants';
import BrandMotif from '../components/ui/BrandMotif';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const [tab, setTab] = useState('signin');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signIn(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signUp(formData.email, formData.password, formData.fullName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scroll-area" style={{ background: T.blushBg, minHeight: '100vh' }}>
      <Navbar />
      
      <div className="content-wrap" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 5vw, 60px) 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center', width: '100%', maxWidth: 1100 }}>
          
          {/* Brand/Hero Section */}
          <div className="fade-up" style={{ textAlign: 'left' }}>
            <h1 className="playfair" style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontStyle: 'italic', color: T.burgundyDeep, lineHeight: 1.1, marginBottom: 24 }}>Welcome<br />back</h1>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 20, color: T.textMuted, fontStyle: 'italic', lineHeight: 1.6 }}>sign in to your little corner ✦</p>
          </div>

          {/* Form Card */}
          <div className="fade-up-1" style={{ background: '#fff', borderRadius: 28, padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 15px 40px rgba(107, 26, 46, 0.05)', position: 'relative', border: '0.5px solid #EDD0D6' }}>
            
            <div className="playfair" style={{ fontSize: 32, fontStyle: 'italic', color: T.burgundyDeep, textAlign: 'center', marginBottom: 12 }}>
              {tab === 'signin' ? 'Sign in' : 'Sign up'}
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted, fontStyle: 'italic', marginBottom: 40 }}>
              Please fill in your details below:
            </div>

            <AnimatePresence mode="wait">
              {tab === 'signin' ? (
                <motion.div key="signin" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <form onSubmit={handleSignIn}>
                    <div style={{ display: 'grid', gap: 20, marginBottom: 32 }}>
                      <div>
                        <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Email address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="hello@example.com" 
                          style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Password</label>
                        <input 
                          type="password" 
                          required
                          value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                          placeholder="••••••••" 
                          style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                        />
                      </div>
                    </div>

                    {error && <div style={{ color: 'red', fontFamily: 'EB Garamond, serif', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 28, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
                      ✦ &nbsp; {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted }}>
                    Don't have an account? <span onClick={() => setTab('signup')} style={{ color: T.burgundyDeep, cursor: 'pointer', borderBottom: `1px solid ${T.burgundy}` }}>Create account</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <form onSubmit={handleSignUp}>
                    <div style={{ display: 'grid', gap: 20, marginBottom: 32 }}>
                      <div>
                        <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Full name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                          placeholder="your full name" 
                          style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Email address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="hello@example.com" 
                          style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Password</label>
                        <input 
                          type="password" 
                          required minLength={6}
                          value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                          placeholder="••••••••" 
                          style={{ background: '#FFF7F8', border: 'none', padding: '16px 20px', borderRadius: 14, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                        />
                      </div>
                    </div>

                    {error && <div style={{ color: 'red', fontFamily: 'EB Garamond, serif', fontSize: 14, marginBottom: 20, textAlign: 'center' }}>{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 28, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
                      ✦ &nbsp; {loading ? 'Creating...' : 'Create account'}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted }}>
                    Already have an account? <span onClick={() => setTab('signin')} style={{ color: T.burgundyDeep, cursor: 'pointer', borderBottom: `1px solid ${T.burgundy}` }}>Log in</span>
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

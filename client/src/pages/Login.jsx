import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { T } from '../lib/constants';
import BrandMotif from '../components/ui/BrandMotif';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, loginWithGoogle } = useAuthStore();
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

  const handleGoogleLogin = async () => {
    setLoading(true); setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(err.code || err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scroll-area" style={{ background: T.blushBg, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Decorative Motifs — stars, bows, hearts, circles, flourishes */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 1100 900" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Stars */}
        <polygon points="55,48 59,62 73,62 62,70 66,84 55,76 44,84 48,70 37,62 51,62" fill={T.burgundy} opacity="0.18"/>
        <polygon points="980,55 983,65 993,65 985,71 988,81 980,75 972,81 975,71 967,65 977,65" fill={T.burgundy} opacity="0.14"/>
        <polygon points="30,390 34,403 47,403 37,410 41,423 30,415 19,423 23,410 13,403 26,403" fill={T.burgundy} opacity="0.16"/>
        <polygon points="1070,480 1073,490 1083,490 1075,497 1078,507 1070,501 1062,507 1065,497 1057,490 1067,490" fill={T.burgundy} opacity="0.18"/>
        <polygon points="520,22 523,31 532,31 525,37 528,46 520,40 512,46 515,37 508,31 517,31" fill={T.burgundy} opacity="0.11"/>
        <polygon points="140,745 143,754 152,754 145,760 148,769 140,763 132,769 135,760 128,754 137,754" fill={T.burgundy} opacity="0.13"/>
        <polygon points="950,795 953,804 962,804 955,810 958,819 950,813 942,819 945,810 938,804 947,804" fill={T.burgundy} opacity="0.15"/>
        {/* Bows */}
        <g transform="translate(90,135) scale(1.3)" opacity="0.18" stroke={T.burgundy} strokeWidth="1">
          <path d="M0,0 C-14,-10 -22,-4 -16,2 C-10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C14,-10 22,-4 16,2 C10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C-8,6 -16,12 -20,18" fill="none"/>
          <path d="M0,0 C8,6 16,12 20,18" fill="none"/>
          <circle cx="0" cy="1" r="2.5" fill={T.burgundy} opacity="0.3"/>
        </g>
        <g transform="translate(1020,120) scale(1.0)" opacity="0.15" stroke={T.burgundy} strokeWidth="1">
          <path d="M0,0 C-14,-10 -22,-4 -16,2 C-10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C14,-10 22,-4 16,2 C10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C-8,6 -16,12 -20,18" fill="none"/>
          <path d="M0,0 C8,6 16,12 20,18" fill="none"/>
          <circle cx="0" cy="1" r="2.5" fill={T.burgundy} opacity="0.3"/>
        </g>
        <g transform="translate(40,695) scale(0.85)" opacity="0.15" stroke={T.burgundy} strokeWidth="1">
          <path d="M0,0 C-14,-10 -22,-4 -16,2 C-10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C14,-10 22,-4 16,2 C10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C-8,6 -16,12 -20,18" fill="none"/>
          <path d="M0,0 C8,6 16,12 20,18" fill="none"/>
          <circle cx="0" cy="1" r="2.5" fill={T.burgundy} opacity="0.3"/>
        </g>
        <g transform="translate(1060,670) scale(1.1)" opacity="0.17" stroke={T.burgundy} strokeWidth="1">
          <path d="M0,0 C-14,-10 -22,-4 -16,2 C-10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C14,-10 22,-4 16,2 C10,8 0,0 0,0 Z" fill="none"/>
          <path d="M0,0 C-8,6 -16,12 -20,18" fill="none"/>
          <path d="M0,0 C8,6 16,12 20,18" fill="none"/>
          <circle cx="0" cy="1" r="2.5" fill={T.burgundy} opacity="0.3"/>
        </g>
        {/* Hearts */}
        <path d="M160,192 C160,183 150,176 150,188 C150,200 160,210 160,210 C160,210 170,200 170,188 C170,176 160,183 160,192 Z" fill={T.burgundy} opacity="0.10"/>
        <path d="M940,295 C940,288 932,282 932,292 C932,302 940,310 940,310 C940,310 948,302 948,292 C948,282 940,288 940,295 Z" fill={T.burgundy} opacity="0.09"/>
        <path d="M70,510 C70,497 56,488 56,504 C56,520 70,532 70,532 C70,532 84,520 84,504 C84,488 70,497 70,510 Z" fill={T.burgundy} opacity="0.08"/>
        <path d="M365,815 C365,807 356,800 356,811 C356,822 365,830 365,830 C365,830 374,822 374,811 C374,800 365,807 365,815 Z" fill={T.burgundy} opacity="0.09"/>
        <path d="M750,805 C750,799 743,794 743,803 C743,812 750,818 750,818 C750,818 757,812 757,803 C757,794 750,799 750,805 Z" fill={T.burgundy} opacity="0.08"/>
        {/* Circle halos */}
        <circle cx="100" cy="100" r="90" stroke={T.burgundy} strokeWidth="0.5" opacity="0.10"/>
        <circle cx="1000" cy="800" r="130" stroke={T.burgundy} strokeWidth="0.4" opacity="0.09"/>
        <circle cx="550" cy="450" r="320" stroke={T.burgundy} strokeWidth="0.3" opacity="0.06"/>
        <circle cx="200" cy="600" r="70" stroke={T.burgundy} strokeWidth="0.5" opacity="0.08"/>
        <circle cx="900" cy="150" r="100" stroke={T.burgundy} strokeWidth="0.4" opacity="0.08"/>
        {/* Curved flourishes */}
        <path d="M0,200 Q150,120 280,240 Q420,360 320,480" stroke={T.burgundy} strokeWidth="0.6" opacity="0.07"/>
        <path d="M1100,300 Q950,400 1020,550 Q1080,680 950,750" stroke={T.burgundy} strokeWidth="0.6" opacity="0.07"/>
        <path d="M200,880 Q350,800 480,860 Q600,920 720,840" stroke={T.burgundy} strokeWidth="0.5" opacity="0.06"/>
      </svg>
      
      <div className="content-wrap" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 5vw, 60px) 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center', width: '100%', maxWidth: 1100 }}>
          
          {/* Brand/Hero Section */}
          <div className="fade-up" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.25em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 18 }}>✦ &nbsp; mystic wonders &nbsp; ✦</div>
            <h1 className="playfair" style={{ fontSize: 'clamp(44px, 6vw, 68px)', fontStyle: 'italic', color: T.burgundyDeep, lineHeight: 1.1, marginBottom: 20 }}>Welcome<br />back</h1>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 20, color: T.textAccent, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 28 }}>sign in to your little corner ✦</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, maxWidth: 240, margin: '0 auto', opacity: 0.35 }}>
              <div style={{ flex: 1, height: 0.5, background: T.burgundy }} />
              <span style={{ fontSize: 13, color: T.burgundy }}>✦</span>
              <div style={{ flex: 1, height: 0.5, background: T.burgundy }} />
            </div>
          </div>

          {/* Form Card */}
          <div className="fade-up-1" style={{ background: '#fff', borderRadius: 28, padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 15px 40px rgba(107, 26, 46, 0.05)', position: 'relative', border: '0.5px solid #EDD0D6' }}>
            
            <div className="playfair" style={{ fontSize: 32, fontStyle: 'italic', color: T.burgundyDeep, textAlign: 'center', marginBottom: 12 }}>
              {tab === 'signin' ? 'Sign in' : 'Sign up'}
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.textMuted, fontStyle: 'italic', marginBottom: 30 }}>
              Please fill in your details below:
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ width: '100%', marginBottom: 24, padding: '12px', borderRadius: 28, background: '#fff', border: `1px solid ${T.blushBorder}`, color: T.textAccent, fontFamily: 'EB Garamond, serif', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#FFF7F8'}
              onMouseOut={e => e.currentTarget.style.background = '#fff'}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.938 5.48 18 9 18z" fill="#34A853"/><path d="M3.964 10.71a4.41 4.41 0 0 1 0-2.82V5.558H.957a8.993 8.993 0 0 0 0 6.883l3.007-2.331z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.48 0 2.438 2.062.957 4.966L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, opacity: 0.3 }}>
              <div style={{ flex: 1, height: 0.5, background: T.textAccent }} />
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, textTransform: 'uppercase' }}>or</div>
              <div style={{ flex: 1, height: 0.5, background: T.textAccent }} />
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

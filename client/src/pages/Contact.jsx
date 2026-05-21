import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { T } from '../lib/constants';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        read: false,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send. Please ensure Firestore is enabled.");
    }
  };

  return (
    <div className="scroll-area" style={{ background: T.cream }}>
      <Navbar />
      
      <div className="content-wrap" style={{ padding: '80px 20px 100px' }}>
        <div style={{ maxWidth: 1050, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 60, alignItems: 'start' }}>
            
            {/* Left side: Info */}
            <div className="fade-up">
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 12, letterSpacing: '0.2em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 20 }}>✦ Get in touch</div>
              <h1 className="playfair" style={{ fontSize: "clamp(48px, 6vw, 72px)", fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 32, lineHeight: 1.1 }}>We love hearing<br/>from <em style={{ color: T.burgundyMid }}>you</em></h1>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 20, color: T.textMuted, fontStyle: 'italic', marginBottom: 40, lineHeight: 1.8, maxWidth: 450 }}>
                Have a question about your order, want to collaborate, or just want to say hi? ✦
              </p>

              <div style={{ display: 'grid', gap: 24 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: T.blushLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✦</div>
                  <div>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent }}>Email us</div>
                    <div className="playfair" style={{ fontStyle: 'italic', fontSize: 20, color: T.burgundyDeep }}>hello@mysticwonders.shop</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: T.blushLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✦</div>
                  <div>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent }}>WhatsApp</div>
                    <div className="playfair" style={{ fontStyle: 'italic', fontSize: 20, color: T.burgundyDeep }}>+92 300 1234567</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: T.blushLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✦</div>
                  <div>
                    <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent }}>Instagram</div>
                    <div className="playfair" style={{ fontStyle: 'italic', fontSize: 20, color: T.burgundyDeep }}>@mysticwonders.shop</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="fade-up-1">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ background: '#fff', borderRadius: 24, padding: 50, border: `1px solid ${T.blushBorder}`, textAlign: 'center', boxShadow: '0 15px 40px rgba(107, 26, 46, 0.05)' }}
                >
                  <div style={{ width: 80, height: 80, background: T.burgundy, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#fff' }}>✓</div>
                  <h2 className="playfair" style={{ fontSize: 32, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 16 }}>Message Sent!</h2>
                  <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, lineHeight: 1.6 }}>Thank you for reaching out. We will get back to you soon ✦</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '32px', borderRadius: 24, boxShadow: '0 15px 40px rgba(107, 26, 46, 0.05)', border: `1px solid ${T.blushBorder}` }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, display: 'block', marginBottom: 10 }}>Full name</label>
                    <input 
                      type="text" 
                      className="field-input" 
                      placeholder="Your name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ background: '#FFF7F8', border: 'none', padding: '14px 18px', borderRadius: 12, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, display: 'block', marginBottom: 10 }}>Email address</label>
                    <input 
                      type="email" 
                      className="field-input" 
                      placeholder="hello@example.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{ background: '#FFF7F8', border: 'none', padding: '14px 18px', borderRadius: 12, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                    />
                  </div>
                  <div style={{ marginBottom: 30 }}>
                    <label style={{ fontFamily: 'EB Garamond, serif', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, display: 'block', marginBottom: 10 }}>Message</label>
                    <textarea 
                      placeholder="How can we help?" 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      style={{ background: '#FFF7F8', border: 'none', padding: '14px 18px', borderRadius: 12, width: '100%', fontFamily: 'EB Garamond, serif', fontSize: 16, minHeight: 140, resize: 'none', color: T.burgundyDeep, outline: 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 16, borderRadius: 28 }}>✦ &nbsp; Send message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

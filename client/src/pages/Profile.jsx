import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { T } from '../lib/constants';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { seedDatabase } from '../lib/seedDatabase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'addresses'
  
  // Addresses tracking locally
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'orders'), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // sort by date descending manually
        fetched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(fetched);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    const updated = [...addresses, newAddress.trim()];
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { addresses: updated }, { merge: true });
      setAddresses(updated);
      setNewAddress('');
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleDeleteAddress = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { addresses: updated }, { merge: true });
      setAddresses(updated);
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="scroll-area" style={{ background: T.blushBg, minHeight: '100vh' }}>
      <Navbar />
      
      <div className="content-wrap" style={{ marginTop: 60, paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          
          <div className="fade-up" style={{ marginBottom: 40 }}>
            <h1 className="playfair" style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 8 }}>
              Hello, {user.fullName || 'friend'} ✦
            </h1>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted }}>
              Welcome to your personal space.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 40, alignItems: 'start' }}>
            
            {/* Sidebar */}
            <div className="fade-up" style={{ background: '#fff', borderRadius: 24, padding: 32, border: `0.5px solid ${T.blushBorder}`, boxShadow: '0 10px 30px rgba(107, 26, 46, 0.03)' }}>
              <div style={{ paddingBottom: 24, borderBottom: `0.5px solid ${T.blushBorder}`, marginBottom: 24 }}>
                <div className="playfair" style={{ fontSize: 20, color: T.burgundyDeep, fontStyle: 'italic', marginBottom: 4 }}>{user.fullName}</div>
                <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, color: T.textAccent }}>{user.email}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button 
                  onClick={() => setActiveTab('orders')}
                  style={{ textAlign: 'left', padding: '12px 16px', borderRadius: 12, background: activeTab === 'orders' ? '#FFF7F8' : 'transparent', color: activeTab === 'orders' ? T.burgundyDeep : T.textMuted, fontFamily: 'EB Garamond, serif', fontSize: 16, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Order history
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  style={{ textAlign: 'left', padding: '12px 16px', borderRadius: 12, background: activeTab === 'addresses' ? '#FFF7F8' : 'transparent', color: activeTab === 'addresses' ? T.burgundyDeep : T.textMuted, fontFamily: 'EB Garamond, serif', fontSize: 16, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Saved addresses
                </button>
              </div>

              <button 
                onClick={handleLogout}
                style={{ width: '100%', marginTop: 32, padding: '14px', borderRadius: 16, background: 'transparent', border: `1px solid ${T.burgundy}`, color: T.burgundy, fontFamily: 'EB Garamond, serif', fontSize: 16, cursor: 'pointer' }}
              >
                Sign out
              </button>

              <button 
                onClick={seedDatabase}
                style={{ width: '100%', marginTop: 16, padding: '14px', borderRadius: 16, background: '#FFF7F8', border: 'none', color: T.textMuted, fontFamily: 'EB Garamond, serif', fontSize: 14, cursor: 'pointer' }}
              >
                Developer: Seed Firestore
              </button>
            </div>

            {/* Main Content Area */}
            <div className="fade-up-1">
              
              {activeTab === 'orders' && (
                <div style={{ background: '#fff', borderRadius: 24, padding: 40, border: `0.5px solid ${T.blushBorder}`, boxShadow: '0 10px 30px rgba(107, 26, 46, 0.03)' }}>
                  <h2 className="playfair" style={{ fontSize: 28, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 30 }}>Your orders</h2>
                  
                  {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'EB Garamond, serif', color: T.textMuted, fontStyle: 'italic' }}>
                      You haven't placed any orders yet. Time to find something magical ✦
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 20 }}>
                      {orders.map(order => (
                        <div key={order.id} style={{ border: `1px solid ${T.blushBorder}`, borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.1em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 6 }}>Order #{order.id.slice(0, 8)}</div>
                            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 15, color: T.textMuted }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="playfair" style={{ fontSize: 18, color: T.burgundyDeep, marginBottom: 4 }}>Rs {order.total}</div>
                            <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textAccent, textTransform: 'capitalize', fontStyle: 'italic' }}>{order.status || 'Processing'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div style={{ background: '#fff', borderRadius: 24, padding: 40, border: `0.5px solid ${T.blushBorder}`, boxShadow: '0 10px 30px rgba(107, 26, 46, 0.03)' }}>
                  <h2 className="playfair" style={{ fontSize: 28, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 30 }}>Saved addresses</h2>
                  
                  {addresses.length === 0 ? (
                    <p style={{ fontFamily: 'EB Garamond, serif', color: T.textMuted, fontStyle: 'italic', marginBottom: 20 }}>No addresses saved yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: 16, marginBottom: 30 }}>
                      {addresses.map((addr, idx) => (
                        <div key={idx} style={{ background: '#FFF7F8', padding: '16px 20px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep }}>{addr}</div>
                          <button onClick={() => handleDeleteAddress(idx)} style={{ background: 'none', border: 'none', color: T.textMuted, fontSize: 14, cursor: 'pointer', fontFamily: 'EB Garamond, serif' }}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: `0.5px solid ${T.blushBorder}` }}>
                    <h3 style={{ fontFamily: 'EB Garamond, serif', fontSize: 14, letterSpacing: '0.1em', color: T.textAccent, textTransform: 'uppercase', marginBottom: 16 }}>Add new address</h3>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <input 
                        value={newAddress}
                        onChange={e => setNewAddress(e.target.value)}
                        placeholder="House no, street, area, city..." 
                        style={{ flex: 1, background: '#FFF7F8', border: 'none', padding: '14px 18px', borderRadius: 12, fontFamily: 'EB Garamond, serif', fontSize: 16, color: T.burgundyDeep, outline: 'none' }}
                      />
                      <button onClick={handleAddAddress} className="btn-primary" style={{ padding: '0 24px', borderRadius: 12 }}>Add</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

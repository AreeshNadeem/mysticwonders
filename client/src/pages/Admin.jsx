import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { T } from '../lib/constants';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tab, setTab] = useState('wonders'); // 'wonders' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'necklaces', sub: '', 
    bg: '#FDF0F3', badge: '', stock: '', inspiration: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      fetched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(fetched);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    console.log("Admin: Starting save process...");
    
    try {
      let finalId = editingId;
      let isNew = !editingId;
      
      // 1. Determine the ID first
      if (isNew) {
        const numericIds = products.map(p => Number(p.id)).filter(id => !isNaN(id));
        finalId = String(numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1);
        console.log("Admin: New product ID will be:", finalId);
      } else {
        finalId = String(editingId);
        console.log("Admin: Updating product ID:", finalId);
      }

      let imageUrl = formData.image || '';

      // 2. Upload image if a NEW file was selected
      if (file) {
        console.log("Admin: Uploading file to Storage...", file.name);
        try {
          const fileRef = ref(storage, `products/${finalId}`);
          const uploadResult = await uploadBytes(fileRef, file);
          imageUrl = await getDownloadURL(uploadResult.ref);
          console.log("Admin: Upload complete. URL:", imageUrl);
        } catch (uploadErr) {
          console.warn("Admin: Direct upload failed (likely CORS). Falling back to URL if provided.", uploadErr);
          if (!imageUrl) {
            throw new Error("Direct upload failed. Please try pasting a direct image link in the 'Image URL' field instead! ✦");
          }
        }
      }

      // 3. Save to Firestore
      const docData = {
        ...formData,
        image: imageUrl,
        price: Number(formData.price),
        stock: Number(formData.stock) || null,
        updatedAt: new Date().toISOString()
      };

      if (isNew) {
        docData.createdAt = new Date().toISOString();
        console.log("Admin: Creating document in Firestore...");
        await setDoc(doc(db, 'products', finalId), docData);
      } else {
        console.log("Admin: Updating document in Firestore...");
        await updateDoc(doc(db, 'products', finalId), docData);
      }

      console.log("Admin: Product saved successfully!");
      setFormData({ name: '', price: '', category: 'necklaces', sub: '', bg: '#FDF0F3', badge: '', stock: '', inspiration: '' });
      setFile(null);
      setPreviewUrl(null);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Admin: Save error:", err);
      alert("Error saving product: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setPreviewUrl(p.image || null);
    setFormData({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image || '',
      sub: p.sub || '',
      bg: p.bg || '#FDF0F3',
      badge: p.badge || '',
      stock: p.stock || '',
      inspiration: p.inspiration || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wonder?")) return;
    try {
      await deleteDoc(doc(db, 'products', String(id)));
      fetchProducts();
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  // Basic security check (ideally based on a role in DB)
  const isAdmin = user?.email === 'hello.mysticwonders@gmail.com';

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.cream, padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 40, color: T.burgundy, marginBottom: 20, opacity: 0.3 }}>✦</div>
          <h2 className="playfair" style={{ fontSize: 28, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 12 }}>Access Restricted</h2>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 18, color: T.textMuted, lineHeight: 1.6, marginBottom: 32 }}>
            You haven't been granted admin magic yet. Please contact the high priestess for access ✦
          </p>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }} onClick={() => navigate('/profile')}>Return to Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-area" style={{ background: T.cream, minHeight: '100vh' }}>
      <Navbar />

      <div className="content-wrap" style={{ padding: '60px 20px 120px', maxWidth: 1200 }}>
        
        {/* Header Tabs */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 60, borderBottom: '0.5px solid #EDD0D6', paddingBottom: 16 }}>
          <div 
            onClick={() => setTab('wonders')}
            style={{ 
              fontFamily: 'EB Garamond, serif', fontSize: 18, fontStyle: 'italic', cursor: 'pointer',
              color: tab === 'wonders' ? T.burgundy : T.textAccent,
              borderBottom: tab === 'wonders' ? `2px solid ${T.burgundy}` : 'none',
              paddingBottom: 16, marginBottom: -17, transition: 'all 0.2s'
            }}
          >
            Manage Wonders
          </div>
          <div 
            onClick={() => setTab('orders')}
            style={{ 
              fontFamily: 'EB Garamond, serif', fontSize: 18, fontStyle: 'italic', cursor: 'pointer',
              color: tab === 'orders' ? T.burgundy : T.textAccent,
              borderBottom: tab === 'orders' ? `2px solid ${T.burgundy}` : 'none',
              paddingBottom: 16, marginBottom: -17, transition: 'all 0.2s'
            }}
          >
            Manage Orders
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B6070', marginBottom: 8 }}>Total Revenue</div>
              <div className="playfair" style={{ fontSize: 20, color: T.burgundyDeep }}>Rs {totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {tab === 'wonders' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 60 }}>
            
            {/* Add Product Section */}
            <div className="fade-up">
              <h1 className="playfair" style={{ fontSize: 42, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 32 }}>
                {editingId ? 'Edit wonder' : 'Add new wonder'}
              </h1>
              
              <form onSubmit={handleAdd} style={{ background: '#fff', padding: 32, borderRadius: 28, border: '0.5px solid #EDD0D6', boxShadow: '0 15px 40px rgba(107, 26, 46, 0.05)', display: 'grid', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 20, alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Product Photo (Direct Upload)</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', fontFamily: 'EB Garamond', fontSize: 14 }} />
                    <div style={{ marginTop: 12 }}>
                      <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>OR Paste Image URL</label>
                      <input 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        placeholder="https://example.com/photo.jpg" 
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #EDD0D6', outline: 'none', fontSize: 14 }} 
                      />
                    </div>
                  </div>
                  {previewUrl && (
                    <div style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', border: '1px solid #EDD0D6' }}>
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Price (Rs)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }}>
                      <option value="necklaces">Necklaces</option>
                      <option value="keychains">Keychains</option>
                      <option value="rings">Rings</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="phone-charms">Phone Charms</option>
                      <option value="hairpins">Hairpins</option>
                      <option value="bookmarks">Bookmarks</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Sub-title</label>
                    <input value={formData.sub} onChange={e => setFormData({...formData, sub: e.target.value})} placeholder="e.g. beaded with love" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>BG Color (Hex)</label>
                    <input value={formData.bg} onChange={e => setFormData({...formData, bg: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Inspiration</label>
                  <textarea 
                    value={formData.inspiration} 
                    onChange={e => setFormData({...formData, inspiration: e.target.value})} 
                    placeholder="The story behind this piece..." 
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none', minHeight: 80, resize: 'none', fontFamily: 'EB Garamond, serif' }} 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Stock Count</label>
                    <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="e.g. 10" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Badge (Optional)</label>
                    <input value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="New / Bestseller" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button disabled={actionLoading} type="submit" className="btn-primary" style={{ flex: 1, padding: 14 }}>
                    {actionLoading ? 'Saving...' : editingId ? '✦ Update wonder' : '✦ Create product'}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFile(null);
                        setPreviewUrl(null);
                        setFormData({ name: '', price: '', category: 'necklaces', sub: '', bg: '#FDF0F3', badge: '', stock: '', inspiration: '' });
                      }}
                      style={{ padding: '0 24px', borderRadius: 28, border: '1px solid #EDD0D6', background: 'transparent', color: T.textAccent, cursor: 'pointer', fontFamily: 'EB Garamond' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Manage Products */}
            <div className="fade-up-1">
              <h2 className="playfair" style={{ fontSize: 32, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 32 }}>Active wonders ({products.length})</h2>
              {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {products.map(p => (
                    <div key={p.id} style={{ 
                      background: p.stock && p.stock < 3 ? '#FFF9F9' : '#fff', 
                      padding: 20, borderRadius: 20, 
                      border: p.stock && p.stock < 3 ? '1px solid #FFD6D6' : '0.5px solid #EDD0D6', 
                      display: 'flex', alignItems: 'center', gap: 16,
                      position: 'relative'
                    }}>
                      {p.stock && p.stock < 3 && (
                        <div style={{ position: 'absolute', top: -10, right: 20, background: '#D32F2F', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: 10, fontFamily: 'EB Garamond', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Low stock: {p.stock}</div>
                      )}
                      <div style={{ width: 60, height: 60, borderRadius: 12, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {p.image ? (
                          <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 24, color: '#6B1A2E' }}>✦</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="playfair" style={{ fontSize: 17, color: T.burgundyDeep }}>{p.name} <span style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textAccent, opacity: 0.6 }}>#{p.id}</span></div>
                        <div style={{ fontFamily: 'EB Garamond, serif', fontSize: 13, color: T.textMuted }}>Rs {p.price} · {p.category}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEdit(p)} style={{ padding: '8px 12px', borderRadius: 10, background: '#fff', color: T.textAccent, border: '0.5px solid #EDD0D6', cursor: 'pointer', fontSize: 13 }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={{ padding: '8px 12px', borderRadius: 10, background: '#FFF7F8', color: T.burgundy, border: '0.5px solid #EDD0D6', cursor: 'pointer', fontSize: 13 }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="fade-up">
            <h2 className="playfair" style={{ fontSize: 32, fontStyle: 'italic', color: T.burgundyDeep, marginBottom: 40 }}>Global order history</h2>
            
            <div style={{ display: 'grid', gap: 24 }}>
              {orders.length === 0 ? (
                <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', color: T.textMuted }}>No orders found yet ✦</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={{ background: '#fff', padding: 32, borderRadius: 28, border: '0.5px solid #EDD0D6', boxShadow: '0 10px 30px rgba(107, 26, 46, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ background: T.blushLight, color: T.burgundy, borderRadius: 30, padding: '4px 14px', fontFamily: 'EB Garamond', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>#{order.id.substring(0, 8).toUpperCase()}</span>
                        <span style={{ fontFamily: 'EB Garamond', fontSize: 15, color: T.textMuted }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="playfair" style={{ fontSize: 20, color: T.burgundyDeep, marginBottom: 8 }}>{order.customerName || 'Mystic Customer'}</div>
                      <div style={{ fontFamily: 'EB Garamond', fontSize: 16, color: T.textAccent, fontStyle: 'italic' }}>{order.email}</div>
                      <div style={{ marginTop: 12, fontFamily: 'EB Garamond', fontSize: 15, color: T.textMuted }}>
                        {order.items?.map(it => it.name).join(', ')}
                      </div>
                    </div>

                    <div style={{ flex: '0 0 200px', textAlign: 'right' }}>
                      <div className="playfair" style={{ fontSize: 24, color: T.burgundy, marginBottom: 16 }}>Rs {order.total}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                        <div style={{ 
                          padding: '6px 16px', borderRadius: 20, fontSize: 12, fontFamily: 'EB Garamond', textTransform: 'uppercase', letterSpacing: '0.05em',
                          background: order.status === 'shipped' ? '#E8F5E9' : order.status === 'delivered' ? '#F3E5F5' : order.status === 'made' ? '#FFF9F0' : '#FFF7F8',
                          color: order.status === 'shipped' ? '#2E7D32' : order.status === 'delivered' ? '#7B1FA2' : order.status === 'made' ? '#A0522D' : T.burgundy,
                          border: `0.5px solid ${order.status === 'shipped' ? '#A5D6A7' : order.status === 'delivered' ? '#CE93D8' : order.status === 'made' ? '#FFDDAA' : '#EDD0D6'}`
                        }}>
                          {order.status === 'pending' || !order.status ? 'Placed' : 
                           order.status === 'made' ? 'Being Made' :
                           order.status === 'shipped' ? 'Shipped' :
                           order.status === 'delivered' ? 'Delivered' : order.status}
                        </div>
                        
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          {(order.status === 'pending' || !order.status) && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'made')}
                              style={{ padding: '6px 12px', borderRadius: 10, background: T.burgundy, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}
                            >
                              Mark as Made
                            </button>
                          )}
                          {order.status === 'made' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                              style={{ padding: '6px 12px', borderRadius: 10, background: '#D2691E', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}
                            >
                              Mark as Shipped
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              style={{ padding: '6px 12px', borderRadius: 10, background: '#2E7D32', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}
                            >
                              Mark as Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

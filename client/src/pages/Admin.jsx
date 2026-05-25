import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Cropper from 'react-easy-crop';
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
    bg: '#FDF0F3', badge: '', stock: '', inspiration: '',
    options: [], images: []
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [files, setFiles] = useState([]); // Multiple files
  const [previewUrls, setPreviewUrls] = useState([]); // Multiple previews

  // Cropping states
  const [cropFile, setCropFile] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

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

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise(resolve => { image.onload = resolve; });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
      0, 0, pixelCrop.width, pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleApplyCrop = async () => {
    try {
      const croppedBlob = await createCroppedImage(cropImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], cropFile.name, { type: 'image/jpeg' });
      setFiles([...files, croppedFile]);
      setPreviewUrls([...previewUrls, URL.createObjectURL(croppedBlob)]);
      setShowCropper(false);
      setCropFile(null);
      setCropImage(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      let finalId = editingId;
      let isNew = !editingId;
      
      if (isNew) {
        const numericIds = products.map(p => Number(p.id)).filter(id => !isNaN(id));
        finalId = String(numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1);
      } else {
        finalId = String(editingId);
      }

      let imageUrls = [...(formData.images || [])];

      // Upload files to Storage
      for (const f of files) {
        const fileRef = ref(storage, `products/${finalId}/${Date.now()}_${f.name}`);
        const uploadResult = await uploadBytes(fileRef, f);
        const url = await getDownloadURL(uploadResult.ref);
        imageUrls.push(url);
      }

      // Save to Firestore
      const docData = {
        ...formData,
        image: imageUrls[0] || '', // Primary image
        images: imageUrls,
        price: Number(formData.price),
        stock: Number(formData.stock) || null,
        options: formData.options || [],
        updatedAt: new Date().toISOString()
      };

      if (isNew) {
        docData.createdAt = new Date().toISOString();
        await setDoc(doc(db, 'products', finalId), docData);
      } else {
        await updateDoc(doc(db, 'products', finalId), docData);
      }

      setFormData({ name: '', price: '', category: 'necklaces', sub: '', bg: '#FDF0F3', badge: '', stock: '', inspiration: '', options: [], images: [] });
      setFiles([]);
      setPreviewUrls([]);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Admin: Save error:", err);
      alert("Error saving product: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    if (selectedFiles.length === 1) {
      // Single file - show cropper for precision
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
        setCropFile(selectedFiles[0]);
        setShowCropper(true);
      };
      reader.readAsDataURL(selectedFiles[0]);
    } else {
      // Multiple files - add them directly for speed
      setActionLoading(true);
      try {
        const newFiles = [...files, ...selectedFiles];
        const newPreviews = [...previewUrls, ...selectedFiles.map(f => URL.createObjectURL(f))];
        setFiles(newFiles);
        setPreviewUrls(newPreviews);
      } finally {
        setActionLoading(false);
      }
    }
    // Reset input so same file can be picked again
    e.target.value = '';
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setPreviewUrls(p.images || (p.image ? [p.image] : []));
    setFormData({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image || '',
      images: p.images || (p.image ? [p.image] : []),
      sub: p.sub || '',
      bg: p.bg || '#FDF0F3',
      badge: p.badge || '',
      stock: p.stock || '',
      inspiration: p.inspiration || '',
      options: p.options || []
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
                {/* Photo Upload Section */}
                <div>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ width: '100%', fontFamily: 'EB Garamond', fontSize: 14 }} />
                  <p style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>✦ Tip: Select multiple files at once to skip cropping for speed.</p>
                  
                  {previewUrls.length > 0 && (
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                      {previewUrls.map((url, i) => (
                        <div key={i} style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: '1px solid #EDD0D6', position: 'relative' }}>
                          <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={() => {
                              const newPreviews = [...previewUrls];
                              newPreviews.splice(i, 1);
                              setPreviewUrls(newPreviews);
                              const newFiles = [...files];
                              newFiles.splice(i, 1);
                              setFiles(newFiles);
                              // If it's an existing image, we should probably remove it from formData too
                              if (formData.images && formData.images.includes(url)) {
                                setFormData({ ...formData, images: formData.images.filter(img => img !== url) });
                              }
                            }}
                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer' }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #EDD0D6', outline: 'none' }} />
                </div>

                {/* Options Section */}
                <div style={{ border: '1px solid #EDD0D6', borderRadius: 16, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent }}>Product Options (e.g. Colors)</label>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, options: [...(formData.options || []), { name: '', price: formData.price }] })}
                      style={{ background: 'transparent', border: 'none', color: T.burgundy, cursor: 'pointer', fontSize: 12, fontFamily: 'EB Garamond' }}
                    >+ Add Option</button>
                  </div>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {formData.options?.map((opt, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 30px', gap: 10, alignItems: 'center' }}>
                        <input 
                          placeholder="Option Name (e.g. Red)" 
                          value={opt.name} 
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[i].name = e.target.value;
                            setFormData({ ...formData, options: newOpts });
                          }}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #EDD0D6', fontSize: 13 }}
                        />
                        <input 
                          type="number" 
                          placeholder="Price" 
                          value={opt.price} 
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[i].price = Number(e.target.value);
                            setFormData({ ...formData, options: newOpts });
                          }}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #EDD0D6', fontSize: 13 }}
                        />
                        <button 
                          type="button" 
                          onClick={() => setFormData({ ...formData, options: formData.options.filter((_, idx) => idx !== i) })}
                          style={{ background: 'none', border: 'none', color: T.burgundy, cursor: 'pointer' }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Base Price (Rs)</label>
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
                        setFiles([]);
                        setPreviewUrls([]);
                        setFormData({ name: '', price: '', category: 'necklaces', sub: '', bg: '#FDF0F3', badge: '', stock: '', inspiration: '', options: [], images: [] });
                      }}
                      style={{ padding: '0 24px', borderRadius: 28, border: '1px solid #EDD0D6', background: 'transparent', color: T.textAccent, cursor: 'pointer', fontFamily: 'EB Garamond' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Cropper Modal */}
            {showCropper && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ background: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 500 }}>
                  <h3 className="playfair" style={{ marginBottom: 20, fontStyle: 'italic' }}>Adjust photo</h3>
                  <div style={{ position: 'relative', height: 300, background: '#eee', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                    <Cropper
                      image={cropImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textAccent, marginBottom: 8 }}>Zoom</label>
                    <input 
                      type="range" value={zoom} min={1} max={3} step={0.1}
                      onChange={(e) => setZoom(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleApplyCrop} className="btn-primary" style={{ flex: 1 }}>Apply Crop</button>
                    <button onClick={() => setShowCropper(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

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

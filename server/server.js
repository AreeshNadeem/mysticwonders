require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'https://mysticwonders.shop'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));

app.get('/', (req, res) => res.json({ message: '✦ Mystic Wonders API is live' }));

// ── Error handler (must be last) ────────────────────────
app.use(errorHandler);

// ── DB + Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✦ MongoDB connected');
    app.listen(PORT, () => console.log(`✦ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

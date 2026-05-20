// Global error handler — must be registered LAST in Express
module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  // Mongo duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already in use` });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message: messages });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token' });
  if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired' });

  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
};

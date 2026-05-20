const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, trim: true, default: '' },
    phone:    { type: String, required: true, unique: true, trim: true },
    role:     { type: String, enum: ['customer', 'admin'], default: 'customer' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    otp:      { code: String, expiresAt: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Never return the OTP in queries by default
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.otp;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);

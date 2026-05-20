const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    inspiration: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, required: true, enum: ['keychains', 'necklaces', 'earrings', 'bracelets', 'other'], lowercase: true },
    stock:       { type: Number, default: 0, min: 0 },
    images:      [{ type: String }],
    tags:        [{ type: String }],
    badge:       { type: String, default: null },   // "New", "Bestseller", "Sold out"
    soldOut:     { type: Boolean, default: false },
    details: {
      material: String,
      length:   String,
      charm:    String,
      shipsIn:  String,
    },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-mark soldOut when stock hits 0
productSchema.pre('save', function (next) {
  if (this.stock === 0) this.soldOut = true;
  next();
});

module.exports = mongoose.model('Product', productSchema);

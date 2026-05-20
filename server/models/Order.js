const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true, min: 1 },
  image:    { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = guest
    items:       [orderItemSchema],
    delivery: {
      name:    { type: String, required: true },
      phone:   { type: String, required: true },
      city:    { type: String, required: true },
      address: { type: String, required: true },
    },
    payment: {
      method: { type: String, enum: ['cod', 'easypaisa', 'bank'], default: 'cod' },
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    },
    subtotal: { type: Number, required: true },
    delivery_fee: { type: Number, default: 150 },
    total:    { type: Number, required: true },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'making', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    coupon:   { type: String, default: null },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year  = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `MW-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

const Order   = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
exports.placeOrder = async (req, res, next) => {
  try {
    const { items, delivery, payment } = req.body;

    // Validate stock and build item list
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.soldOut) {
        return res.status(400).json({ message: `${product?.name || 'A product'} is no longer available` });
      }
      if (product.stock > 0 && product.stock < item.qty) {
        return res.status(400).json({ message: `Only ${product.stock} of ${product.name} left in stock` });
      }
      orderItems.push({ product: product._id, name: product.name, price: product.price, qty: item.qty, image: product.images?.[0] || '' });
      subtotal += product.price * item.qty;
      // Decrement stock
      if (product.stock > 0) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    const deliveryFee = 150;
    const order = await Order.create({
      user: req.user?._id || null,
      items: orderItems,
      delivery,
      payment: { method: payment?.method || 'cod' },
      subtotal,
      delivery_fee: deliveryFee,
      total: subtotal + deliveryFee,
    });

    res.status(201).json(order);
  } catch (err) { next(err); }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'name images');
    res.json(orders);
  } catch (err) { next(err); }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Users can only see their own orders; admins see all
    if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorised' });
    }
    res.json(order);
  } catch (err) { next(err); }
};

// PUT /api/orders/:id/status  (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
};

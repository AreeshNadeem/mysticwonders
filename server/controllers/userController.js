const User = require('../models/User');

// GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images category');
    res.json(user);
  } catch (err) { next(err); }
};

// PUT /api/users/wishlist  — body: { productId, action: 'add' | 'remove' }
exports.updateWishlist = async (req, res, next) => {
  try {
    const { productId, action } = req.body;
    const user = await User.findById(req.user._id);

    if (action === 'add') {
      if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
    } else {
      user.wishlist = user.wishlist.filter((id) => String(id) !== productId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) { next(err); }
};

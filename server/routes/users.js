const express = require('express');
const router  = express.Router();
const { getMe, updateWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me',          protect, getMe);
router.put('/wishlist',    protect, updateWishlist);

module.exports = router;

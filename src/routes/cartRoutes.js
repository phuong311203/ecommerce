const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Tất cả API giỏ hàng chỉ dành cho customer (user)
router.get('/', authMiddleware(["customer"]), getCart);
router.post('/add', authMiddleware(["customer"]), addToCart);
router.put('/update', authMiddleware(["customer"]), updateCartItem);
router.delete('/remove', authMiddleware(["customer"]), removeFromCart);

module.exports = router;

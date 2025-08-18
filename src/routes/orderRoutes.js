const express = require('express');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Khách hàng
router.post('/', authMiddleware(["customer"]), createOrder);
router.get('/my', authMiddleware(["customer"]), getMyOrders);

// Admin quản lý tất cả đơn hàng
router.get('/', authMiddleware(["admin"]), getAllOrders);
router.put('/:id', authMiddleware(["admin", "seller"]), updateOrderStatus);

module.exports = router;

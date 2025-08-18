const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Seller/Admin
router.post('/', authMiddleware(["seller", "admin"]), createProduct);
router.put('/:id', authMiddleware(["seller", "admin"]), updateProduct);
router.delete('/:id', authMiddleware(["seller", "admin"]), deleteProduct);

module.exports = router;

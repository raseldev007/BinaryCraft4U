const express = require('express');
const router = express.Router();
const { createOrder, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;

const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, notes, paymentMethod } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }
        const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const order = await Order.create({
            user: req.user.id,
            items: cart.items,
            totalAmount,
            shippingAddress,
            notes,
            paymentMethod: paymentMethod || 'cod'
        });
        await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
        res.status(201).json({ success: true, order });
    } catch (error) { next(error); }
};

exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        res.json({ success: true, order });
    } catch (error) { next(error); }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status, paymentStatus }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    } catch (error) { next(error); }
};

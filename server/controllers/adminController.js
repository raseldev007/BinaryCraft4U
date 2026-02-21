const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Contact = require('../models/Contact');

exports.getDashboard = async (req, res, next) => {
    try {
        const [usersCount, ordersCount, productsCount, servicesCount, messagesCount, recentOrders, orders] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Order.countDocuments(),
            Product.countDocuments({ isActive: true }),
            Service.countDocuments({ isActive: true }),
            Contact.countDocuments({ isRead: false }),
            Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
            Order.find({ paymentStatus: 'paid' })
        ]);
        const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        res.json({ success: true, data: { usersCount, ordersCount, productsCount, servicesCount, messagesCount, revenue, recentOrders } });
    } catch (error) { next(error); }
};

exports.getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = { role: 'user' };
        if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
        const total = await User.countDocuments(query);
        res.json({ success: true, users, total });
    } catch (error) { next(error); }
};

exports.toggleBlockUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ success: true, message: user.isBlocked ? 'User blocked' : 'User unblocked', user });
    } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) { next(error); }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query = status ? { status } : {};
        const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
        const total = await Order.countDocuments(query);
        res.json({ success: true, orders, total });
    } catch (error) { next(error); }
};

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) { next(error); }
};

exports.markMessageRead = async (req, res, next) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true, message: 'Marked as read' });
    } catch (error) { next(error); }
};

const User = require('../models/User');
const Order = require('../models/Order');

// @desc Get profile
// @route GET /api/users/profile
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
};

// @desc Update profile
// @route PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, address } = req.body;
        const updates = { name, phone, address };
        if (req.file) updates.avatar = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
        res.json({ success: true, user });
    } catch (error) { next(error); }
};

// @desc Change password
// @route PUT /api/users/change-password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) { next(error); }
};

// @desc Get my orders
// @route GET /api/users/orders
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) { next(error); }
};

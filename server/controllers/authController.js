const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// @desc Register user
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) { next(error); }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        if (user.isBlocked) return res.status(403).json({ success: false, message: 'Your account has been blocked' });
        const token = generateToken(user._id);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    } catch (error) { next(error); }
};

// @desc Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};

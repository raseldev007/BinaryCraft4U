const Cart = require('../models/Cart');

exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = { items: [], totalAmount: 0 };
        res.json({ success: true, cart });
    } catch (error) { next(error); }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { itemId, itemType, title, price, quantity = 1, image } = req.body;
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = new Cart({ user: req.user.id, items: [] });
        const existingIndex = cart.items.findIndex(i => i.itemId.toString() === itemId && i.itemType === itemType);
        if (existingIndex >= 0) {
            cart.items[existingIndex].quantity += quantity;
        } else {
            cart.items.push({ itemId, itemType, title, price, quantity, image });
        }
        await cart.save();
        res.json({ success: true, cart });
    } catch (error) { next(error); }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { itemId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
        const item = cart.items.find(i => i._id.toString() === itemId);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });
        item.quantity = quantity;
        await cart.save();
        res.json({ success: true, cart });
    } catch (error) { next(error); }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
        cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
        await cart.save();
        res.json({ success: true, cart });
    } catch (error) { next(error); }
};

exports.clearCart = async (req, res, next) => {
    try {
        await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) { next(error); }
};

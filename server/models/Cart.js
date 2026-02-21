const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ['product', 'service'], required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String, default: '' }
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema]
}, { timestamps: true });

cartSchema.virtual('totalAmount').get(function () {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);

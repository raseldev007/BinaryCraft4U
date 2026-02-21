const Product = require('../models/Product');

// @desc Get all products
// @route GET /api/products
exports.getProducts = async (req, res, next) => {
    try {
        const { category, search, featured, page = 1, limit = 12 } = req.query;
        const query = { isActive: true };
        if (category) query.category = category;
        if (featured) query.isFeatured = true;
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
        const total = await Product.countDocuments(query);
        const products = await Product.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
        res.json({ success: true, products, total, pages: Math.ceil(total / limit), page });
    } catch (error) { next(error); }
};

// @desc Get single product
// @route GET /api/products/:id
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (error) { next(error); }
};

// @desc Create product (admin)
// @route POST /api/products
exports.createProduct = async (req, res, next) => {
    try {
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const product = await Product.create({ ...req.body, images });
        res.status(201).json({ success: true, product });
    } catch (error) { next(error); }
};

// @desc Update product (admin)
// @route PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (error) { next(error); }
};

// @desc Delete product (admin)
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) { next(error); }
};

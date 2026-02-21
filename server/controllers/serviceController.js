const Service = require('../models/Service');

exports.getServices = async (req, res, next) => {
    try {
        const { category, search, featured } = req.query;
        const query = { isActive: true };
        if (category) query.category = category;
        if (featured) query.isFeatured = true;
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
        const services = await Service.find(query).sort({ createdAt: -1 });
        res.json({ success: true, services });
    } catch (error) { next(error); }
};

exports.getService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.json({ success: true, service });
    } catch (error) { next(error); }
};

exports.createService = async (req, res, next) => {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        const service = await Service.create({ ...req.body, image });
        res.status(201).json({ success: true, service });
    } catch (error) { next(error); }
};

exports.updateService = async (req, res, next) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.json({ success: true, service });
    } catch (error) { next(error); }
};

exports.deleteService = async (req, res, next) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Service deleted' });
    } catch (error) { next(error); }
};

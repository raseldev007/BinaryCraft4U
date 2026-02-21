const Contact = require('../models/Contact');

exports.sendMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = await Contact.create({ name, email, subject, message });
        res.status(201).json({ success: true, message: 'Message sent successfully', contact });
    } catch (error) { next(error); }
};

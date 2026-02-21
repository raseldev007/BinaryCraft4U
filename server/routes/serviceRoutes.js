const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, adminOnly, upload.single('image'), createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;

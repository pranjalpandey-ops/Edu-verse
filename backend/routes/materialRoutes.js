const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { upload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/upload', protect, upload.single('file'), materialController.uploadMaterial);
router.get('/', protect, materialController.getMaterials);
router.get('/:id', protect, materialController.getMaterialById);
router.delete('/:id', protect, materialController.deleteMaterial);

module.exports = router;

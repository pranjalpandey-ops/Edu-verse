const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, progressController.getProgress);
router.get('/weak-areas', protect, progressController.getWeakAreas);

module.exports = router;

const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, assessmentController.generateAssessment);
router.post('/:id/submit', protect, assessmentController.submitAssessment);
router.get('/:id/report', protect, assessmentController.getReport);

module.exports = router;

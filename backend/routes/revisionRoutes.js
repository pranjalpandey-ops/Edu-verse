const express = require('express');
const router = express.Router();
const controller = require('../controllers/revisionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/today', verifyToken, controller.getTodayDue);
router.post('/review', verifyToken, controller.submitReview);
router.get('/upcoming', verifyToken, controller.getUpcoming);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, controller.getOverview);
router.get('/weekly', verifyToken, controller.getWeekly);
router.get('/subjects', verifyToken, controller.getSubjects);

module.exports = router;

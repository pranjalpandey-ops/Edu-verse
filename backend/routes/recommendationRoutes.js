const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, controller.getRecommendations);

module.exports = router;

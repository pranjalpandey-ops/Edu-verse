const express = require('express');
const router = express.Router();
const controller = require('../controllers/learningProfileController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, controller.getProfile);
router.post('/', verifyToken, controller.updateProfile);
router.put('/', verifyToken, controller.updateProfile);

module.exports = router;

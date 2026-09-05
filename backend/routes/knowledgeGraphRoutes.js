const express = require('express');
const router = express.Router();
const controller = require('../controllers/knowledgeGraphController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/prerequisites', verifyToken, controller.getPrerequisites);

module.exports = router;

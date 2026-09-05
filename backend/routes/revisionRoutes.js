const express = require('express');
const router = express.Router();
const revisionController = require('../controllers/revisionController');

router.get('/', (req, res) => revisionController.getRevisionItems(req, res));
router.post('/review', (req, res) => revisionController.recordReview(req, res));

module.exports = router;

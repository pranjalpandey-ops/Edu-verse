const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', (req, res) => searchController.search(req, res));
router.post('/', (req, res) => searchController.search(req, res));

module.exports = router;

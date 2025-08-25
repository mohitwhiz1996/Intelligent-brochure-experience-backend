const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const brochureController = require('../controllers/brochureController');

router.post('/', authenticateToken, brochureController.createBrosure);
router.get('/', authenticateToken, brochureController.getBrosure);

module.exports = router;

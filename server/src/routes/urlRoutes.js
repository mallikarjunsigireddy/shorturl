const express = require('express');
const urlController = require('../controllers/urlController');

const router = express.Router();

router.get('/api/v1/urls', urlController.getUrls);
router.post('/api/v1/urls', urlController.shortenUrl);

// Wildcard route MUST remain at the bottom so it doesn't intercept /api or /health
router.get('/:shortCode', urlController.redirectUrl);

module.exports = router;
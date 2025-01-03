const express = require('express');
const { handleGenerateNewShortURL, handleGtAnalytics } = require("../controllers/url");
const router = express.Router();

router.post('/', handleGenerateNewShortURL);

router.get('/analytics/:shortId', handleGtAnalytics);

module.exports = router;
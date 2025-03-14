// routes/embedRoutes.js
const express = require('express');
const router = express.Router();
const embedController = require('../controllers/embedController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/generate', authMiddleware, embedController.generateEmbedCode);

module.exports = router;

// controllers/embedController.js
const securityService = require('../services/securityService');
const Video = require('../models/Video');

exports.generateEmbedCode = async (req, res, next) => {
  try {
    const { videoId } = req.body;
    // Validate video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    // Generate secure embed code (tokenized URL etc.)
    const embedCode = securityService.generateEmbedCode(videoId);
    res.status(200).json({ embedCode });
  } catch (error) {
    next(error);
  }
};

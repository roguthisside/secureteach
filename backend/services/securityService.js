// services/securityService.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

// Generates a secure, tokenized embed code.
exports.generateEmbedCode = (videoId) => {
  // Create a token that expires in 15 minutes
  const token = jwt.sign({ videoId }, jwtSecret, { expiresIn: '15m' });
  // Return embed code snippet (could be an iframe with a tokenized URL)
  return `<iframe src="https://yourdomain.com/videos/${videoId}?token=${token}" frameborder="0" allowfullscreen></iframe>`;
};

// (Optional) Token verification for embed requests
exports.verifyEmbedToken = (token) => {
  try {
    const payload = jwt.verify(token, jwtSecret);
    return payload;
  } catch (error) {
    return null;
  }
};

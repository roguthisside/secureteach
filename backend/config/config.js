// config/config.js
module.exports = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET,
    dbUri: process.env.DB_URI
  };
  
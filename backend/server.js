// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const dbConnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const embedRoutes = require('./routes/embedRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Connect to database
dbConnect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/embed', embedRoutes);

// Serve processed videos statically (for secure streaming)
app.use('/videos', express.static(path.join(__dirname, 'uploads/processed')));

// Global error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

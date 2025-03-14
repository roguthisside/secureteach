// controllers/videoController.js
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const videoProcessingService = require('../services/videoProcessingService');
const teacherApiService = require('../services/teacherApiService');

exports.uploadVideo = async (req, res, next) => {
  try {
    // Only teachers can upload videos
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can upload videos' });
    }
    // File is stored in req.file by multer
    const rawVideoPath = req.file.path;
    const processedDir = path.join('uploads', 'processed');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }
    const processedVideoPath = path.join(processedDir, req.file.filename);

    // Fetch student data from teacher's website (simulate for now)
    const studentData = await teacherApiService.fetchStudentData(req.user.id);

    // Process video with dynamic watermarking
    await videoProcessingService.processVideo(rawVideoPath, processedVideoPath, studentData);

    // Save video metadata in DB
    const video = new Video({
      title: req.body.title,
      teacher: req.user.id,
      rawFilePath: rawVideoPath,
      processedFilePath: processedVideoPath
    });
    await video.save();

    res.status(200).json({ message: 'Video uploaded and processed successfully', video });
  } catch (error) {
    next(error);
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    let videos;
    if (req.user.role === 'teacher') {
      videos = await Video.find({ teacher: req.user.id });
    } else {
      videos = await Video.find({});
    }
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// services/videoProcessingService.js
const { exec } = require('child_process');

exports.processVideo = (inputPath, outputPath, studentData) => {
  return new Promise((resolve, reject) => {
    // Dynamic watermark: Overlay student's name and phone number.
    // Adjust the ffmpeg command as needed.
    const watermarkText = `${studentData.name} - ${studentData.phone}`;
    const ffmpegCommand = `ffmpeg -i ${inputPath} -vf "drawtext=text='${watermarkText}':fontcolor=white@0.8:fontsize=24:x=10:y=10" -codec:a copy ${outputPath}`;
    
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        return reject(`Error processing video: ${error.message}`);
      }
      resolve();
    });
  });
};

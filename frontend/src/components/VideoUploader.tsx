
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Video, Check } from 'lucide-react';

interface VideoUploaderProps {
  onVideoUploaded: (videoInfo: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
  }) => void;
}

const VideoUploader = ({ onVideoUploaded }: VideoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      processVideoFile(selectedFile);
    }
  };
  
  // Process video file
  const processVideoFile = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Create blob URL for preview
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
    
    // Set default title from filename if not already set
    if (!title) {
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setTitle(fileName);
    }
    
    // Create video element to get duration and generate thumbnail
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      setDuration(video.duration);
      
      // Generate thumbnail from the video
      generateThumbnail(url);
    };
    
    video.src = url;
  };
  
  // Generate thumbnail from video
  const generateThumbnail = (videoUrl: string) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.currentTime = 1; // Seek to 1 second to avoid black frames
    
    video.onloadeddata = () => {
      // Create canvas and draw video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL (thumbnail)
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setThumbnailUrl(thumbnailDataUrl);
      }
    };
  };
  
  // Handle drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  // Handle drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      processVideoFile(droppedFile);
    }
  };
  
  // Open file dialog
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    setVideoUrl('');
    setThumbnailUrl('');
    setDuration(0);
    setIsComplete(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle video upload (simulation)
  const handleUpload = () => {
    if (!file || !title) return;
    
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsComplete(true);
          
          // Call the onVideoUploaded callback
          onVideoUploaded({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            duration,
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  return (
    <div className="w-full space-y-6">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-accent/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary/70" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Upload a video</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop a video file here, or click to browse
              </p>
            </div>
            
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Supported formats: MP4, WebM, MOV, AVI<br />
                Maximum file size: 500MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">Video Information</h3>
            
            {!isUploading && !isComplete && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRemoveFile}
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video thumbnail/preview */}
            <div className="md:col-span-1">
              <div className="aspect-video bg-black rounded-md overflow-hidden relative">
                {videoUrl && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                  />
                )}
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                {file?.name}<br />
                {file && `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                {duration > 0 && ` • ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`}
              </div>
            </div>
            
            {/* Video information form */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Video title"
                  required
                  disabled={isUploading || isComplete}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video (optional)"
                  className="min-h-[120px] resize-y"
                  disabled={isUploading || isComplete}
                />
              </div>
            </div>
          </div>
          
          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            {!isUploading && !isComplete ? (
              <Button 
                type="button" 
                onClick={handleUpload}
                disabled={!file || !title}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            ) : isComplete ? (
              <Button variant="outline" className="flex items-center gap-2" disabled>
                <Check className="h-4 w-4 text-green-500" />
                Upload Complete
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;

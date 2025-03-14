
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Upload as UploadIcon, Info, FileVideo } from 'lucide-react';
import VideoUploader from '@/components/VideoUploader';
import { contentService, defaultSecurityOptions, defaultWatermarkOptions } from '@/utils/security';

const Upload = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle video upload completion
  const handleVideoUploaded = (videoInfo: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
  }) => {
    try {
      setIsUploading(true);
      // Add content to storage
      const newContent = contentService.addContent({
        title: videoInfo.title,
        description: videoInfo.description,
        videoUrl: videoInfo.videoUrl,
        thumbnailUrl: videoInfo.thumbnailUrl,
        duration: videoInfo.duration,
        uploadDate: new Date().toISOString(),
        securityOptions: defaultSecurityOptions,
        watermarkOptions: defaultWatermarkOptions,
      });
      
      toast.success('Video uploaded successfully');
      
      // Navigate to configuration page after a brief delay
      setTimeout(() => {
        setIsUploading(false);
        navigate(`/configure/${newContent.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Error saving video information');
      setIsUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Educational Content</h1>
            <p className="text-muted-foreground">
              Upload your videos to start protecting them with our advanced security features
            </p>
          </div>
          
          <Card className="mb-8 border-primary/10 shadow-md">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Secure Upload</CardTitle>
              </div>
              <CardDescription>
                Your content is encrypted during upload and stored securely
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <VideoUploader onVideoUploaded={handleVideoUploaded} />
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-accent/30 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileVideo className="h-5 w-5 text-primary" />
                  Supported Formats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>MP4 (H.264 codec)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>MOV (QuickTime)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>AVI (Audio Video Interleave)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>WebM (for web optimization)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-accent/30 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-primary" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>Upload your educational video</li>
                  <li>Configure security settings (watermarking, access control)</li>
                  <li>Set distribution options</li>
                  <li>Share securely with your students</li>
                  <li>Track analytics and engagement</li>
                </ol>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 p-4 border rounded-lg bg-primary/5 text-sm">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Security Features:
            </h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <span>Screen recording prevention</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <span>Screenshot blocking</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <span>Download protection</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <span>Window sharing restrictions</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <span>Custom watermarking</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <span>IP-based access restrictions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;

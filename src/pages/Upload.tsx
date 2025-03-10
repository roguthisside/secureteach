
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoUploader from '@/components/VideoUploader';
import { contentService, defaultSecurityOptions, defaultWatermarkOptions } from '@/utils/security';

const Upload = () => {
  const navigate = useNavigate();
  
  // Handle video upload completion
  const handleVideoUploaded = (videoInfo: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
  }) => {
    try {
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
        navigate(`/configure/${newContent.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Error saving video information');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
              <p className="text-muted-foreground">
                Upload your educational content to start protecting it
              </p>
            </div>
            
            <VideoUploader onVideoUploaded={handleVideoUploaded} />
            
            <div className="mt-10 p-4 border rounded-lg bg-accent/30">
              <h3 className="text-sm font-medium mb-2">Note:</h3>
              <p className="text-sm text-muted-foreground">
                After uploading, you'll be able to configure security settings including:
                <br />• Screen recording prevention
                <br />• Screenshot blocking
                <br />• Download protection
                <br />• Window sharing restrictions
                <br />• Custom watermarking
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;

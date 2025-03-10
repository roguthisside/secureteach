
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Download, 
  Tv2, 
  Lock, 
  Fingerprint,
  Copy,
  CheckCircle,
  Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';

const Configure = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<any>(null);
  const [securityOptions, setSecurityOptions] = useState({
    preventScreenshots: true,
    preventRecording: true,
    preventDownloads: true,
    preventWindowSharing: false,
    enableWatermarking: false
  });
  const [watermarkOptions, setWatermarkOptions] = useState({
    includeStudentName: true,
    includeStudentEmail: true,
    includeTimestamp: true,
    opacity: 0.3,
    position: 'center',
    isMoving: true,
    movementSpeed: 'medium'
  });
  const [embedCode, setEmbedCode] = useState('');

  // Simulate fetching video data
  useEffect(() => {
    // In a real app, this would be an API call to get video data
    setTimeout(() => {
      setVideo({
        id: videoId,
        title: 'Introduction to Digital Security',
        duration: '32:15',
        thumbnail: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNlY3VyaXR5fGVufDB8fDB8fHww',
        uploadDate: '2023-10-15',
        size: '145 MB'
      });
      setLoading(false);
    }, 800);
  }, [videoId]);

  // Generate embed code based on security options
  useEffect(() => {
    if (!video) return;
    
    const securityParams = Object.entries(securityOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
      
    const watermarkParams = securityOptions.enableWatermarking 
      ? '&' + Object.entries(watermarkOptions)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : '';
    
    const code = `<iframe 
  src="https://secureteach.io/embed/${videoId}?${securityParams}${watermarkParams}" 
  width="100%" 
  height="450" 
  frameborder="0" 
  allow="encrypted-media" 
  allowfullscreen>
</iframe>`;
    
    setEmbedCode(code);
  }, [video, securityOptions, watermarkOptions, videoId]);

  const handleSecurityOptionChange = (option: string) => (checked: boolean) => {
    setSecurityOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleWatermarkOptionChange = (option: string) => (checked: boolean) => {
    setWatermarkOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleWatermarkPositionChange = (position: string) => {
    setWatermarkOptions(prev => ({
      ...prev,
      position
    }));
  };

  const handleWatermarkOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWatermarkOptions(prev => ({
      ...prev,
      opacity: value
    }));
  };

  const handleMovementSpeedChange = (speed: 'slow' | 'medium' | 'fast') => {
    setWatermarkOptions(prev => ({
      ...prev,
      movementSpeed: speed
    }));
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Video Preview Column */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
              <CardDescription>Configure security for this video</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden bg-muted mb-4">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{video.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span>{video.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{video.size}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Column */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="security">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="security">Security Options</TabsTrigger>
              <TabsTrigger value="embed">Embed Code</TabsTrigger>
            </TabsList>
            
            {/* Security Options Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Basic Security Options
                  </CardTitle>
                  <CardDescription>
                    Configure the security features for your video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prevent-screenshots" className="text-base">Prevent Screenshots</Label>
                      <p className="text-sm text-muted-foreground">
                        Detect and block screenshot attempts
                      </p>
                    </div>
                    <Switch 
                      id="prevent-screenshots" 
                      checked={securityOptions.preventScreenshots}
                      onCheckedChange={handleSecurityOptionChange('preventScreenshots')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prevent-recording" className="text-base">Prevent Screen Recording</Label>
                      <p className="text-sm text-muted-foreground">
                        Block screen recording software
                      </p>
                    </div>
                    <Switch 
                      id="prevent-recording" 
                      checked={securityOptions.preventRecording}
                      onCheckedChange={handleSecurityOptionChange('preventRecording')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prevent-downloads" className="text-base">Prevent Downloads</Label>
                      <p className="text-sm text-muted-foreground">
                        Disable video downloading capabilities
                      </p>
                    </div>
                    <Switch 
                      id="prevent-downloads" 
                      checked={securityOptions.preventDownloads}
                      onCheckedChange={handleSecurityOptionChange('preventDownloads')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prevent-window-sharing" className="text-base">Prevent Window Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Block content from being shared through screen sharing apps
                      </p>
                    </div>
                    <Switch 
                      id="prevent-window-sharing" 
                      checked={securityOptions.preventWindowSharing}
                      onCheckedChange={handleSecurityOptionChange('preventWindowSharing')}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-primary" />
                    Dynamic Watermarking
                  </CardTitle>
                  <CardDescription>
                    Add personalized watermarks to discourage unauthorized sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-watermarking" className="text-base">Enable Watermarking</Label>
                      <p className="text-sm text-muted-foreground">
                        Add dynamic watermarks with student information
                      </p>
                    </div>
                    <Switch 
                      id="enable-watermarking" 
                      checked={securityOptions.enableWatermarking}
                      onCheckedChange={handleSecurityOptionChange('enableWatermarking')}
                    />
                  </div>
                  
                  {securityOptions.enableWatermarking && (
                    <div className="space-y-6 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-student-name">Include Student Name</Label>
                        <Switch 
                          id="include-student-name" 
                          checked={watermarkOptions.includeStudentName}
                          onCheckedChange={handleWatermarkOptionChange('includeStudentName')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-student-email">Include Student Email</Label>
                        <Switch 
                          id="include-student-email" 
                          checked={watermarkOptions.includeStudentEmail}
                          onCheckedChange={handleWatermarkOptionChange('includeStudentEmail')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-timestamp">Include Timestamp</Label>
                        <Switch 
                          id="include-timestamp" 
                          checked={watermarkOptions.includeTimestamp}
                          onCheckedChange={handleWatermarkOptionChange('includeTimestamp')}
                        />
                      </div>
                      
                      {/* Moving Watermark Option */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="moving-watermark" className="text-base">Moving Watermark</Label>
                          <p className="text-sm text-muted-foreground">
                            Make watermark move across the screen to prevent camera recording
                          </p>
                        </div>
                        <Switch 
                          id="moving-watermark" 
                          checked={watermarkOptions.isMoving}
                          onCheckedChange={handleWatermarkOptionChange('isMoving')}
                        />
                      </div>
                      
                      {/* Movement Speed (only shown if moving is enabled) */}
                      {watermarkOptions.isMoving && (
                        <div className="space-y-3">
                          <Label className="text-base">Movement Speed</Label>
                          <RadioGroup 
                            value={watermarkOptions.movementSpeed} 
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="slow" 
                                id="speed-slow" 
                                onClick={() => handleMovementSpeedChange('slow')}
                              />
                              <Label htmlFor="speed-slow">Slow</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="medium" 
                                id="speed-medium" 
                                onClick={() => handleMovementSpeedChange('medium')}
                              />
                              <Label htmlFor="speed-medium">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="fast" 
                                id="speed-fast" 
                                onClick={() => handleMovementSpeedChange('fast')}
                              />
                              <Label htmlFor="speed-fast">Fast</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label>Watermark Position</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(position => (
                            <Button 
                              key={position} 
                              variant={watermarkOptions.position === position ? "default" : "outline"} 
                              size="sm"
                              onClick={() => handleWatermarkPositionChange(position)}
                              className="h-10"
                              disabled={watermarkOptions.isMoving} // Disable position selection when moving
                            >
                              {position.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Button>
                          ))}
                        </div>
                        {watermarkOptions.isMoving && (
                          <p className="text-xs text-muted-foreground italic mt-2">
                            <Move className="h-3 w-3 inline mr-1" />
                            Position selection is disabled when moving watermark is enabled
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="watermark-opacity">Watermark Opacity: {watermarkOptions.opacity}</Label>
                        </div>
                        <Input 
                          id="watermark-opacity"
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={watermarkOptions.opacity}
                          onChange={handleWatermarkOpacityChange}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Embed Code Tab */}
            <TabsContent value="embed">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                  <CardDescription>
                    Copy this code and paste it into your website to embed the secure video player
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-md overflow-x-auto">
                    <pre className="text-sm whitespace-pre-wrap break-all">
                      {embedCode}
                    </pre>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/library')}>
                    Back to Library
                  </Button>
                  <Button onClick={copyEmbedCode} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Embed Code
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Configure;

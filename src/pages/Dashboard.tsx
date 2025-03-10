
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Clock, BarChart2, Shield, Video, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authService } from '@/utils/auth';
import { contentService, type VideoContent } from '@/utils/security';

const Dashboard = () => {
  const [user, setUser] = useState(authService.getUser());
  const [content, setContent] = useState<VideoContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load user content
    const loadContent = () => {
      setIsLoading(true);
      try {
        const userContent = contentService.getAllContent();
        setContent(userContent);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, []);
  
  // Calculate stats
  const totalVideos = content.length;
  const securedVideos = content.filter(item => 
    item.securityOptions.preventScreenRecording || 
    item.securityOptions.preventScreenshots ||
    item.securityOptions.preventDownloading ||
    item.securityOptions.preventWindowSharing
  ).length;
  const watermarkedVideos = content.filter(item => item.watermarkOptions.enabled).length;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">
              Manage your secure educational content
            </p>
          </div>
          
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Card 1 */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Total Content</CardTitle>
                <Video className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalVideos}</div>
                <p className="text-muted-foreground text-sm">Videos uploaded</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/library" className="flex items-center justify-center gap-2">
                    View Library
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Card 2 */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Protected</CardTitle>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{securedVideos}</div>
                <p className="text-muted-foreground text-sm">Videos with security features</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/library" className="flex items-center justify-center gap-2">
                    Security Settings
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Card 3 */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Watermarked</CardTitle>
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{watermarkedVideos}</div>
                <p className="text-muted-foreground text-sm">Videos with watermarking</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/library" className="flex items-center justify-center gap-2">
                    Watermark Settings
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button asChild className="h-auto p-6 flex flex-col items-center gap-3 text-lg font-medium rounded-xl">
                <Link to="/upload">
                  <Upload className="h-10 w-10 mb-1" />
                  Upload New Video
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-6 flex flex-col items-center gap-3 text-lg font-medium rounded-xl">
                <Link to="/library">
                  <Video className="h-10 w-10 mb-1" />
                  Content Library
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-6 flex flex-col items-center gap-3 text-lg font-medium rounded-xl">
                <Link to="#">
                  <Shield className="h-10 w-10 mb-1" />
                  Security Settings
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-6 flex flex-col items-center gap-3 text-lg font-medium rounded-xl">
                <Link to="#">
                  <Clock className="h-10 w-10 mb-1" />
                  Recent Activity
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Recent Content */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Recent Content</h2>
            
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="videos">All Videos</TabsTrigger>
                <TabsTrigger value="secured">Secured</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p>Loading your content...</p>
                  </div>
                ) : content.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.slice(0, 6).map((video) => (
                      <Card key={video.id} className="overflow-hidden transition-all hover:shadow-md">
                        <div className="aspect-video bg-muted relative">
                          {video.thumbnailUrl ? (
                            <img 
                              src={video.thumbnailUrl} 
                              alt={video.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <Video className="h-10 w-10 text-primary/50" />
                            </div>
                          )}
                          
                          {/* Security Badge */}
                          {Object.values(video.securityOptions).some(Boolean) && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Protected
                            </div>
                          )}
                        </div>
                        
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {video.description || 'No description'}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardFooter className="pt-2 flex justify-between">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/configure/${video.id}`}>
                              Configure
                            </Link>
                          </Button>
                          
                          <Button size="sm" asChild>
                            <Link to={`/configure/${video.id}`}>
                              Security Settings
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="mb-4 bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                      <Video className="h-10 w-10 text-primary/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload your first video to get started with securing your content.
                    </p>
                    <Button asChild>
                      <Link to="/upload">Upload Video</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="secured">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p>Loading secured content...</p>
                  </div>
                ) : content.filter(item => 
                    Object.values(item.securityOptions).some(Boolean)
                  ).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content
                      .filter(item => Object.values(item.securityOptions).some(Boolean))
                      .slice(0, 6)
                      .map((video) => (
                        <Card key={video.id} className="overflow-hidden transition-all hover:shadow-md">
                          <div className="aspect-video bg-muted relative">
                            {video.thumbnailUrl ? (
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <Video className="h-10 w-10 text-primary/50" />
                              </div>
                            )}
                            
                            {/* Security Badge */}
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Protected
                            </div>
                          </div>
                          
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {video.description || 'No description'}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardFooter className="pt-2 flex justify-between">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/configure/${video.id}`}>
                                Configure
                              </Link>
                            </Button>
                            
                            <Button size="sm" asChild>
                              <Link to={`/configure/${video.id}`}>
                                Security Settings
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="mb-4 bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-10 w-10 text-primary/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No secured videos</h3>
                    <p className="text-muted-foreground mb-6">
                      Add security features to your videos to protect them from unauthorized use.
                    </p>
                    <Button asChild>
                      <Link to="/library">Go to Library</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p>Loading recent content...</p>
                  </div>
                ) : content.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content
                      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
                      .slice(0, 6)
                      .map((video) => (
                        <Card key={video.id} className="overflow-hidden transition-all hover:shadow-md">
                          <div className="aspect-video bg-muted relative">
                            {video.thumbnailUrl ? (
                              <img 
                                src={video.thumbnailUrl} 
                                alt={video.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <Video className="h-10 w-10 text-primary/50" />
                              </div>
                            )}
                            
                            {/* Security Badge */}
                            {Object.values(video.securityOptions).some(Boolean) && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Protected
                              </div>
                            )}
                          </div>
                          
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {video.description || 'No description'}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardFooter className="pt-2 flex justify-between">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/configure/${video.id}`}>
                                Configure
                              </Link>
                            </Button>
                            
                            <Button size="sm" asChild>
                              <Link to={`/configure/${video.id}`}>
                                Security Settings
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="mb-4 bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="h-10 w-10 text-primary/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No recent uploads</h3>
                    <p className="text-muted-foreground mb-6">
                      Your recently uploaded videos will appear here.
                    </p>
                    <Button asChild>
                      <Link to="/upload">Upload Video</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {content.length > 6 && (
              <div className="mt-8 text-center">
                <Button variant="outline" asChild>
                  <Link to="/library">View All Content</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

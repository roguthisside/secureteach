
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  PlusCircle,
  FileVideo,
  Clock,
  Settings,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  status: 'active' | 'draft' | 'processing';
}

const ContentLibrary = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Simulated data fetch
  useEffect(() => {
    const fetchVideos = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const dummyVideos: Video[] = [
          {
            id: '1',
            title: 'Introduction to Digital Security',
            thumbnail: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNlY3VyaXR5fGVufDB8fDB8fHww',
            duration: '32:15',
            views: 245,
            uploadDate: '2023-10-15',
            status: 'active'
          },
          {
            id: '2',
            title: 'Advanced Machine Learning Concepts',
            thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1hY2hpbmUlMjBsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D',
            duration: '45:30',
            views: 187,
            uploadDate: '2023-11-02',
            status: 'active'
          },
          {
            id: '3',
            title: 'Python Programming for Beginners',
            thumbnail: 'https://images.unsplash.com/photo-1649180556628-9ba704115795?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHB5dGhvbiUyMHByb2dyYW1taW5nfGVufDB8fDB8fHww',
            duration: '28:45',
            views: 312,
            uploadDate: '2023-09-20',
            status: 'active'
          },
          {
            id: '4',
            title: 'Data Structures and Algorithms',
            thumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGF0YSUyMHN0cnVjdHVyZXN8ZW58MHx8MHx8fDA%3D',
            duration: '51:20',
            views: 156,
            uploadDate: '2023-10-10',
            status: 'processing'
          },
          {
            id: '5',
            title: 'Introduction to Web Development',
            thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdlYiUyMGRldmVsb3BtZW50fGVufDB8fDB8fHww',
            duration: '38:15',
            views: 278,
            uploadDate: '2023-11-15',
            status: 'draft'
          },
          {
            id: '6',
            title: 'The Art of Public Speaking',
            thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHB1YmxpYyUyMHNwZWFraW5nfGVufDB8fDB8fHww',
            duration: '42:50',
            views: 195,
            uploadDate: '2023-11-05',
            status: 'active'
          }
        ];
        setVideos(dummyVideos);
        setIsLoading(false);
      }, 1000);
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || video.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const deleteVideo = (videoId: string) => {
    setVideos(videos.filter(video => video.id !== videoId));
    toast.success('Video deleted successfully');
  };

  if (isLoading) {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground mt-1">Manage your educational content</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              className="pl-9 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button asChild>
            <Link to="/upload" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Upload New Video
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveFilter}>
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter}>
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <FileVideo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try a different search term' : 'Upload a video to get started'}
              </p>
              <Button asChild>
                <Link to="/upload">Upload a Video</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video relative group">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button variant="secondary" size="sm" asChild>
                        <Link to={`/configure/${video.id}`}>
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Link>
                      </Button>
                    </div>
                    {video.status !== 'active' && (
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded capitalize">
                        {video.status}
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base font-medium">{video.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" /> 
                      Uploaded {video.uploadDate} • {video.views} views
                    </CardDescription>
                  </CardHeader>
                  
                  <CardFooter className="p-4 pt-2 flex justify-between gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Video</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{video.title}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <Button variant="outline" className="mt-2 sm:mt-0">Cancel</Button>
                          <Button variant="destructive" onClick={() => deleteVideo(video.id)}>
                            Delete Video
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="default" size="sm" className="flex-1" asChild>
                      <Link to={`/configure/${video.id}`} className="gap-1">
                        <Settings className="h-4 w-4" />
                        Configure
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentLibrary;

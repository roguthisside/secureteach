
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
  Trash2,
  Shield,
  Eye,
  Calendar
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

  const statusCounts = {
    all: videos.length,
    active: videos.filter(v => v.status === 'active').length,
    draft: videos.filter(v => v.status === 'draft').length,
    processing: videos.filter(v => v.status === 'processing').length
  };

  const deleteVideo = (videoId: string) => {
    setVideos(videos.filter(video => video.id !== videoId));
    toast.success('Video deleted successfully');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your educational content</p>
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
        
        <div className="bg-card rounded-lg shadow overflow-hidden mb-8">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Video Library Overview</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm mb-1">Total Videos</p>
              <p className="text-3xl font-bold">{statusCounts.all}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm mb-1">Active</p>
              <div className="flex justify-center items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-3xl font-bold">{statusCounts.active}</p>
              </div>
            </div>
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm mb-1">Processing</p>
              <div className="flex justify-center items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <p className="text-3xl font-bold">{statusCounts.processing}</p>
              </div>
            </div>
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm mb-1">Drafts</p>
              <div className="flex justify-center items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <p className="text-3xl font-bold">{statusCounts.draft}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveFilter} className="w-full">
          <TabsList className="mb-6 grid grid-cols-4 md:w-fit">
            <TabsTrigger value="all">All Videos ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="active">Active ({statusCounts.active})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({statusCounts.draft})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({statusCounts.processing})</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeFilter}>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
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
                  <Card key={video.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="aspect-video relative group">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Link 
                          to={`/configure/${video.id}`} 
                          className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-md shadow-lg transition-all duration-200 flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Configure
                        </Link>
                      </div>
                      <div className={`absolute top-3 left-3 ${getStatusColor(video.status)} text-white text-xs font-medium px-2 py-1 rounded-md capitalize`}>
                        {video.status}
                      </div>
                    </div>
                    
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-semibold line-clamp-1">{video.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0 pb-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> 
                          <span>{video.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> 
                          <span>{formatDate(video.uploadDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-2 flex justify-between gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="h-4 w-4 mr-1.5" />
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
                        <Link to={`/configure/${video.id}`} className="gap-1.5">
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
    </div>
  );
};

export default ContentLibrary;

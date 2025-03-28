import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  BookOpen, 
  Video, 
  Trash, 
  Plus, 
  Upload, 
  Shield, 
  Check, 
  Edit, 
  ArrowUpRight 
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/utils/auth';
import { 
  courseService, 
  contentService, 
  enrollmentService, 
  type Course, 
  type CourseVideo, 
  type CourseType,
  type VideoContent,
  videoContentToCourseVideo
} from '@/utils/security';
import PageHeader from '@/components/PageHeader';

// Form schema
const courseSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  price: z.coerce.number().min(0, { message: 'Price must be 0 or higher' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  type: z.enum(['video', 'live'], { required_error: 'Please select a course type' }),
  thumbnailUrl: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived'], { required_error: 'Please select a status' }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const CourseEdit = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const user = authService.getUser();
  
  // Initialize form
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: '',
      type: 'video',
      thumbnailUrl: '/placeholder.svg',
      status: 'draft',
    },
  });
  
  useEffect(() => {
    const loadCourse = () => {
      if (!courseId) return;
      
      try {
        setIsLoading(true);
        const foundCourse = courseService.getCourseById(courseId);
        
        if (!foundCourse) {
          toast.error('Course not found');
          navigate('/courses');
          return;
        }
        
        // Check if user is the instructor
        if (user?.id !== foundCourse.instructorId && user?.role !== 'admin') {
          toast.error('You are not authorized to edit this course');
          navigate('/courses');
          return;
        }
        
        setCourse(foundCourse);
        
        // Set form values
        form.reset({
          title: foundCourse.title,
          description: foundCourse.description,
          price: foundCourse.price,
          category: foundCourse.category,
          type: foundCourse.type,
          thumbnailUrl: foundCourse.thumbnailUrl,
          status: foundCourse.status,
        });
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId, user, navigate, form]);
  
  const onSubmit = async (values: CourseFormValues) => {
    if (!course) return;
    
    try {
      setIsSaving(true);
      
      const updatedCourse = courseService.updateCourse(course.id, {
        ...values,
        type: values.type as CourseType,
      });
      
      setCourse(updatedCourse);
      
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddExistingVideo = (videoId: string) => {
    if (!course || !videoId) return;
    
    try {
      const videoContent = contentService.getContentById(videoId);
      
      if (!videoContent) {
        toast.error('Video not found');
        return;
      }
      
      // Check if video is already in the course
      if (course.videos.some(v => v.id === videoContent.id)) {
        toast.error('This video is already added to the course');
        return;
      }
      
      // Convert VideoContent to CourseVideo and set position
      const courseVideo: Omit<CourseVideo, 'id'> = {
        title: videoContent.title,
        description: videoContent.description,
        videoUrl: videoContent.videoUrl,
        thumbnailUrl: videoContent.thumbnailUrl,
        duration: videoContent.duration,
        position: course.videos.length + 1,
        securityOptions: videoContent.securityOptions,
        watermarkOptions: videoContent.watermarkOptions
      };
      
      // Update the course with the new video
      const updatedCourse = courseService.addVideoToCourse(course.id, courseVideo);
      setCourse(updatedCourse);
      
      toast.success('Video added to course');
    } catch (error) {
      console.error('Error adding video to course:', error);
      toast.error('Failed to add video');
    }
  };
  
  const handleRemoveVideo = (videoId: string) => {
    if (!course || !videoId) return;
    
    try {
      // This function already returns the updated course
      const updatedCourse = courseService.removeVideoFromCourse(course.id, videoId);
      setCourse(updatedCourse);
      
      toast.success('Video removed from course');
    } catch (error) {
      console.error('Error removing video from course:', error);
      toast.error('Failed to remove video');
    }
  };
  
  const handlePublishCourse = () => {
    if (!course) return;
    
    try {
      const updatedCourse = courseService.updateCourse(course.id, {
        status: 'published',
      });
      
      setCourse(updatedCourse);
      form.setValue('status', 'published');
      
      toast.success('Course published successfully');
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error('Failed to publish course');
    }
  };
  
  const handleDeleteCourse = () => {
    if (!course) return;
    
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        courseService.deleteCourse(course.id);
        toast.success('Course deleted successfully');
        navigate('/courses');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="text-2xl font-bold">Course not found</div>
        <p className="text-muted-foreground mt-2">The course you're trying to edit doesn't exist.</p>
        <Button className="mt-6" onClick={() => navigate('/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <PageHeader title={`Edit Course: ${course.title}`} />
        
        <div className="flex flex-wrap gap-3">
          <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="text-xs py-1">
            {course.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
          
          {course.status !== 'published' && (
            <Button size="sm" onClick={handlePublishCourse}>
              Publish Course
            </Button>
          )}
          
          <Button size="sm" variant="outline" asChild>
            <Link to={`/courses/${course.id}`}>
              View Course
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Course Details
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Course Content
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="max-w-3xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what students will learn in this course" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="programming">Programming & Development</SelectItem>
                            <SelectItem value="design">Design & Creative</SelectItem>
                            <SelectItem value="business">Business & Entrepreneurship</SelectItem>
                            <SelectItem value="marketing">Marketing & Communication</SelectItem>
                            <SelectItem value="science">Science & Mathematics</SelectItem>
                            <SelectItem value="language">Languages & Linguistics</SelectItem>
                            <SelectItem value="humanities">Arts & Humanities</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Course Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <RadioGroupItem value="video" />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-medium cursor-pointer">
                                Video Course
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Pre-recorded videos that students can watch at their own pace
                              </p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <RadioGroupItem value="live" />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-medium cursor-pointer">
                                Live Sessions
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Scheduled live sessions with direct interaction with students
                              </p>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    type="button" 
                    onClick={handleDeleteCourse}
                  >
                    Delete Course
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
        
        <TabsContent value="content">
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Course Content</h2>
              
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Video
                  </Link>
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => setActiveTab('library')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Existing Video
                </Button>
              </div>
            </div>
            
            {course.videos.length > 0 ? (
              <div className="space-y-4">
                {course.videos.map((video, index) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="grid md:grid-cols-4 gap-0">
                      <div className="aspect-video bg-muted md:col-span-1">
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
                      </div>
                      
                      <div className="p-6 md:col-span-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{video.title}</h3>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/configure/${video.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveVideo(video.id)}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {video.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              {formatDuration(video.duration)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            Protected Content
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <div className="mb-4 bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <Video className="h-10 w-10 text-primary/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add videos to your course to start teaching.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild>
                    <Link to="/upload">Upload New Video</Link>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('library')}>
                    Add Existing Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-6">Course Settings</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Course Visibility</CardTitle>
                <CardDescription>
                  Control who can see and enroll in your course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Current status: <span className="font-medium capitalize">{course.status}</span>
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {course.status !== 'published' && (
                        <Button size="sm" onClick={handlePublishCourse}>
                          Publish
                        </Button>
                      )}
                      {course.status === 'published' && (
                        <Button size="sm" variant="outline" onClick={() => {
                          form.setValue('status', 'draft');
                          form.handleSubmit(onSubmit)();
                        }}>
                          Unpublish
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>
                  View enrollment data and student progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base">Enrolled Students</Label>
                      <Badge>{course.enrolledCount}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Students currently enrolled in this course
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete this course and all its data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-destructive/20 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Delete Course</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once deleted, all course content, enrollments, and progress data will be permanently removed.
                    This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteCourse}>
                    Delete Course Permanently
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default CourseEdit;

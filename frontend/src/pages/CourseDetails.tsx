
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Calendar, 
  Check, 
  Video, 
  Shield 
} from 'lucide-react';
import { authService } from '@/utils/auth';
import { 
  courseService, 
  enrollmentService, 
  type Course 
} from '@/utils/security';

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const user = authService.getUser();
  
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
        
        setCourse(foundCourse);
        
        // Check if user is already enrolled
        if (user) {
          const enrolled = enrollmentService.isUserEnrolled(user.id, courseId);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId, user, navigate]);
  
  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in courses');
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }
    
    if (!course) return;
    
    try {
      setIsEnrolling(true);
      enrollmentService.enrollUserInCourse(user.id, course.id);
      setIsEnrolled(true);
      toast.success('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in the course');
    } finally {
      setIsEnrolling(false);
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
        <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist.</p>
        <Button className="mt-6" onClick={() => navigate('/courses')}>
          Browse Courses
        </Button>
      </div>
    );
  }
  
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const isInstructor = user?.id === course.instructorId;
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Course information */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={course.type === 'video' ? 'secondary' : 'default'}>
                {course.type === 'video' ? 'Video Course' : 'Live Sessions'}
              </Badge>
              <Badge variant="outline">{course.category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">
              Created by <span className="font-medium">{course.instructor}</span>
            </p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{course.enrolledCount} students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span>{course.videos.length} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last updated {formatDate(course.updatedDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Course Description</h2>
            <div className="prose prose-slate max-w-none">
              <p>{course.description}</p>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.topics && course.topics.length > 0 ? (
                course.topics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No topics specified for this course.</p>
              )}
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {course.videos.length} {course.videos.length === 1 ? 'lesson' : 'lessons'}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {formatTotalDuration(course.videos)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {course.videos.length > 0 ? (
                  <div className="space-y-2">
                    {course.videos.map((video, index) => (
                      <div key={video.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{video.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDuration(video.duration)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Shield className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No content available for this course yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Enrollment card */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="sticky top-24">
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video bg-muted">
                {course.thumbnailUrl ? (
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <BookOpen className="h-16 w-16 text-primary/50" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-6">${course.price.toFixed(2)}</div>
                
                {isInstructor ? (
                  <Button className="w-full mb-4" asChild>
                    <Link to={`/courses/${course.id}/edit`}>
                      Edit Course
                    </Link>
                  </Button>
                ) : isEnrolled ? (
                  <Button className="w-full mb-4" asChild>
                    <Link to={`/courses/${course.id}/learn`}>
                      Go to Course
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    className="w-full mb-4" 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )}
                
                <div className="text-sm text-muted-foreground mb-6">
                  {course.type === 'video' 
                    ? 'Full lifetime access to all course materials'
                    : 'Access to all scheduled live sessions and recordings'
                  }
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>Course Type</span>
                    </div>
                    <span className="font-medium capitalize">
                      {course.type === 'video' ? 'Pre-recorded' : 'Live sessions'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">
                      {formatTotalDuration(course.videos)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Content Protection</span>
                    </div>
                    <span className="font-medium">
                      Enabled
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatTotalDuration = (videos: any[]): string => {
  const totalSeconds = videos.reduce((total, video) => total + video.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minutes`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default CourseDetails;

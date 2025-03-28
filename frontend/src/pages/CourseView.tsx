
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge'; 
import { toast } from 'sonner';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Calendar, 
  Play, 
  Shield, 
  CheckCircle2, 
  LockKeyhole 
} from 'lucide-react';
import { authService } from '@/utils/auth';
import { 
  courseService, 
  enrollmentService, 
  type Course, 
  type CourseVideo,
  type Enrollment,
  generateEmbedCode,
  courseVideoToVideoContent
} from '@/utils/security';

const CourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<CourseVideo | null>(null);
  const [embedCode, setEmbedCode] = useState<string>('');
  const user = authService.getUser();
  
  useEffect(() => {
    const loadCourse = () => {
      if (!courseId || !user) return;
      
      try {
        const foundCourse = courseService.getCourseById(courseId);
        
        if (!foundCourse) {
          toast.error('Course not found');
          navigate('/courses');
          return;
        }
        
        setCourse(foundCourse);
        
        // Check enrollment
        const userEnrollment = enrollmentService.getEnrollmentsByUser(user.id)
          .find(e => e.courseId === courseId);
          
        if (!userEnrollment && foundCourse.instructorId !== user.id) {
          // Navigate to course details if not enrolled and not the instructor
          navigate(`/courses/${courseId}`);
          return;
        }
        
        setEnrollment(userEnrollment || null);
        
        // Set first video as active if none selected
        if (foundCourse.videos.length > 0) {
          const videoToActivate = activeVideoId 
            ? foundCourse.videos.find(v => v.id === activeVideoId) 
            : foundCourse.videos[0];
            
          if (videoToActivate) {
            setActiveVideoId(videoToActivate.id);
            setActiveVideo(videoToActivate);
            
            // Generate embed code for video
            if (userEnrollment || foundCourse.instructorId === user.id) {
              setEmbedCode(generateEmbedCode(
                videoToActivate.id,
                videoToActivate.securityOptions,
                videoToActivate.watermarkOptions
              ));
            }
          }
        }
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId, user, navigate, activeVideoId]);
  
  const markLessonComplete = async (lessonId: string) => {
    if (!user || !courseId || !enrollment) return;
    
    try {
      const updatedEnrollment = enrollmentService.markLessonComplete(
        user.id,
        courseId,
        lessonId
      );
      
      setEnrollment(updatedEnrollment);
      toast.success('Lesson marked as complete');
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast.error('Failed to update progress');
    }
  };
  
  const handleVideoSelect = (videoId: string) => {
    setActiveVideoId(videoId);
  };
  
  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons.includes(lessonId) || false;
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
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{course?.title}</h1>
        <div className="text-muted-foreground">Instructor: {course?.instructor}</div>
        
        {enrollment && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-medium">Your Progress: {Math.round(enrollment.progress)}%</div>
              {enrollment.completed && (
                <Badge variant="default" className="bg-green-500 text-xs">Completed</Badge>
              )}
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video player column */}
        <div className="lg:col-span-2">
          {activeVideo ? (
            <div className="space-y-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {/* Video player */}
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: embedCode }}
                ></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">{activeVideo.title}</h2>
                <p className="text-muted-foreground">{activeVideo.description}</p>
              </div>
              
              {enrollment && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {formatDuration(activeVideo.duration)}
                  </div>
                  
                  <Button 
                    onClick={() => markLessonComplete(activeVideo.id)}
                    disabled={isLessonCompleted(activeVideo.id)}
                    variant={isLessonCompleted(activeVideo.id) ? "secondary" : "default"}
                  >
                    {isLessonCompleted(activeVideo.id) ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium">No video selected</h3>
                <p className="text-muted-foreground mt-2">
                  Please select a lesson from the course content list
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Course content sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              {course.videos.length > 0 ? (
                <div className="space-y-2">
                  {course.videos.map((video) => (
                    <div 
                      key={video.id}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        activeVideoId === video.id 
                          ? 'bg-primary/10 border-l-4 border-primary' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleVideoSelect(video.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isLessonCompleted(video.id) ? (
                            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                          ) : (
                            <Play className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{video.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <LockKeyhole className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No content available yet</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Total Duration: {formatTotalDuration(course.videos)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Secure content with DRM protection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Last updated: {formatDate(course.updatedDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.enrolledCount} students enrolled</span>
                </div>
              </div>
            </CardContent>
          </Card>
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

const formatTotalDuration = (videos: CourseVideo[]): string => {
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

export default CourseView;

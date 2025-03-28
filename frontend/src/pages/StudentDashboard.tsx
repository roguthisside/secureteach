// Fix the references to enrollmentDate to use enrolledDate instead
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CirclePlay, 
  BookOpenCheck, 
  BookOpen, 
  GraduationCap, 
  Trophy,
  CalendarClock,
  Clock
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/utils/auth';
import { courseService, enrollmentService, Enrollment, Course } from '@/utils/security';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = authService.getUser();
  
  useEffect(() => {
    const loadUserData = () => {
      if (!user) return;
      
      try {
        // Get user's enrollments
        const userEnrollments = enrollmentService.getEnrollmentsByUser(user.id);
        setEnrollments(userEnrollments);
        
        // Get enrolled courses
        const enrolledCourses = courseService.getEnrolledCourses(user.id);
        setCourses(enrolledCourses);
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  const getInProgressCourses = () => {
    return enrollments.filter(enrollment => enrollment.progress > 0 && enrollment.progress < 100);
  };
  
  const getCompletedCourses = () => {
    return enrollments.filter(enrollment => enrollment.completed);
  };
  
  // Helper to sort enrollments by date
  const getRecentActivity = () => {
    return [...enrollments].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };
  
  // Get the most recent enrollment
  const getMostRecentEnrollment = () => {
    return [...enrollments].sort((a, b) => {
      return new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime();
    })[0];
  };
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const getCourseById = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // This part has the error with enrollmentDate instead of enrolledDate
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      {enrollments.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Courses Yet</h2>
          <p className="text-muted-foreground mb-8">
            You haven't enrolled in any courses yet. Start your learning journey today!
          </p>
          <Button asChild size="lg">
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="in-progress">
              <TabsList className="mb-4">
                <TabsTrigger value="in-progress" className="flex items-center gap-2">
                  <CirclePlay className="h-4 w-4" />
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4" />
                  All Courses
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="in-progress">
                {getInProgressCourses().length > 0 ? (
                  <div className="space-y-4">
                    {getInProgressCourses().map(enrollment => {
                      const course = getCourseById(enrollment.courseId);
                      return course ? (
                        <Link 
                          key={enrollment.id} 
                          to={`/courses/${course.id}/learn`} 
                          className="block"
                        >
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="md:w-1/4 lg:w-1/5 aspect-video bg-muted rounded overflow-hidden">
                                  <img 
                                    src={course.thumbnailUrl || '/placeholder.svg'} 
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {course.instructor}
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        Progress: {Math.round(enrollment.progress)}%
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        Updated {formatDate(enrollment.updatedAt)}
                                      </span>
                                    </div>
                                    <Progress value={enrollment.progress} className="h-2" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <CirclePlay className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No courses in progress</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Start learning to see your progress here.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed">
                {getCompletedCourses().length > 0 ? (
                  <div className="space-y-4">
                    {getCompletedCourses().map(enrollment => {
                      const course = getCourseById(enrollment.courseId);
                      return course ? (
                        <Link 
                          key={enrollment.id} 
                          to={`/courses/${course.id}/learn`} 
                          className="block"
                        >
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="md:w-1/4 lg:w-1/5 aspect-video bg-muted rounded overflow-hidden">
                                  <img 
                                    src={course.thumbnailUrl || '/placeholder.svg'} 
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {course.instructor}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline">Completed</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Finished on {formatDate(enrollment.updatedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No completed courses yet</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Finish a course to earn a trophy!
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all">
                {enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map(enrollment => {
                      const course = getCourseById(enrollment.courseId);
                      return course ? (
                        <Link 
                          key={enrollment.id} 
                          to={`/courses/${course.id}/learn`} 
                          className="block"
                        >
                          <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="md:w-1/4 lg:w-1/5 aspect-video bg-muted rounded overflow-hidden">
                                  <img 
                                    src={course.thumbnailUrl || '/placeholder.svg'} 
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {course.instructor}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    {enrollment.completed ? (
                                      <Badge variant="outline">Completed</Badge>
                                    ) : (
                                      <span className="text-sm font-medium">
                                        Progress: {Math.round(enrollment.progress)}%
                                      </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      Updated {formatDate(enrollment.updatedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No courses enrolled</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      Enroll in courses to start your learning journey.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Stats</CardTitle>
                <CardDescription>Your learning progress at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>Enrolled Courses</span>
                    </div>
                    <span className="font-semibold">{enrollments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CirclePlay className="h-5 w-5 text-amber-500" />
                      <span>In Progress</span>
                    </div>
                    <span className="font-semibold">{getInProgressCourses().length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-500" />
                      <span>Completed</span>
                    </div>
                    <span className="font-semibold">{getCompletedCourses().length}</span>
                  </div>
                </div>
                
                {enrollments.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="font-medium mb-4">Recently Enrolled</h4>
                    {getMostRecentEnrollment() && (
                      <div className="text-sm">
                        <div className="font-medium">
                          {getCourseById(getMostRecentEnrollment().courseId)?.title}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarClock className="h-3 w-3" />
                          Enrolled on {formatDate(getMostRecentEnrollment().enrolledDate)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest course updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentActivity().slice(0, 3).map(enrollment => {
                    const course = getCourseById(enrollment.courseId);
                    return course ? (
                      <div key={enrollment.id} className="text-sm">
                        <div className="font-medium">{course.title}</div>
                        <div className="text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          Updated {formatDate(enrollment.updatedAt)}
                        </div>
                      </div>
                    ) : null;
                  })}
                  {enrollments.length > 3 && (
                    <Button variant="link" className="w-full justify-start">
                      Show More
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

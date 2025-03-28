
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  BarChart2, 
  Shield, 
  Video, 
  ArrowUpRight, 
  BookOpen, 
  Users, 
  Plus,
  Calendar,
  Clock
} from 'lucide-react';
import { authService } from '@/utils/auth';
import { courseService, type Course } from '@/utils/security';

const TeacherDashboard = () => {
  const [user, setUser] = useState(authService.getUser());
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load user content
    const loadCourses = () => {
      setIsLoading(true);
      try {
        if (user) {
          const userCourses = courseService.getCoursesByInstructor(user.id);
          setCourses(userCourses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourses();
  }, [user?.id]);
  
  // Calculate stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter(course => course.status === 'published').length;
  const totalStudents = courses.reduce((total, course) => total + course.enrolledCount, 0);
  const totalVideos = courses.reduce((total, course) => total + course.videos.length, 0);
  
  return (
    <div className="container mx-auto px-4">
      {/* Dashboard Header */}
      <div className="mb-10 pt-24">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Manage your courses and connect with your students
        </p>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Total Courses</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses}</div>
            <p className="text-muted-foreground text-sm">Courses created</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/courses" className="flex items-center justify-center gap-2">
                View Courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Active</CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCourses}</div>
            <p className="text-muted-foreground text-sm">Published courses</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/courses" className="flex items-center justify-center gap-2">
                View Published
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
            <p className="text-muted-foreground text-sm">Total enrolled students</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <span className="flex items-center justify-center gap-2">
                View Students
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Videos</CardTitle>
            <Video className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVideos}</div>
            <p className="text-muted-foreground text-sm">Total video content</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/library" className="flex items-center justify-center gap-2">
                Content Library
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
            <Link to="/courses/create">
              <Plus className="h-10 w-10 mb-1" />
              Create New Course
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-auto p-6 flex flex-col items-center gap-3 text-lg font-medium rounded-xl">
            <Link to="/upload">
              <Upload className="h-10 w-10 mb-1" />
              Upload Content
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-auto p-6 flex flex-col items-center gap-3 text-lg font-medium rounded-xl">
            <Link to="/library">
              <Video className="h-10 w-10 mb-1" />
              Video Library
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="h-auto p-6 flex flex-col items-center gap-3 text-lg font-medium rounded-xl">
            <Link to="/profile">
              <Users className="h-10 w-10 mb-1" />
              My Profile
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Recent Courses */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6">Your Courses</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p>Loading your courses...</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 6).map((course) => (
                  <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video bg-muted relative">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <BookOpen className="h-10 w-10 text-primary/50" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className={`absolute top-2 right-2 ${
                        course.status === 'published' 
                          ? 'bg-green-500' 
                          : course.status === 'draft' 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-500'
                      } text-white text-xs font-medium px-2 py-1 rounded-full capitalize`}>
                        {course.status}
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        {course.enrolledCount} student{course.enrolledCount !== 1 ? 's' : ''}
                      </div>
                      
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.id}/edit`}>
                          Edit Course
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mb-4 bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-10 w-10 text-primary/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first course to start teaching.
                </p>
                <Button asChild>
                  <Link to="/courses/create">Create a Course</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="published">
            {/* Similar content to "all" but filtered for published courses */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p>Loading published courses...</p>
              </div>
            ) : courses.filter(c => c.status === 'published').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(c => c.status === 'published').slice(0, 6).map((course) => (
                  <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
                    {/* Course card content - same as above */}
                    <div className="aspect-video bg-muted relative">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <BookOpen className="h-10 w-10 text-primary/50" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
                        published
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        {course.enrolledCount} student{course.enrolledCount !== 1 ? 's' : ''}
                      </div>
                      
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.id}/edit`}>
                          Edit Course
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mb-4 bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-10 w-10 text-primary/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No published courses</h3>
                <p className="text-muted-foreground mb-6">
                  Publish your draft courses to make them available to students.
                </p>
                <Button asChild>
                  <Link to="/courses">View All Courses</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="draft">
            {/* Similar content to "all" but filtered for draft courses */}
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p>Loading draft courses...</p>
              </div>
            ) : courses.filter(c => c.status === 'draft').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(c => c.status === 'draft').slice(0, 6).map((course) => (
                  <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
                    {/* Course card content - same as above */}
                    <div className="aspect-video bg-muted relative">
                      {course.thumbnailUrl ? (
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <BookOpen className="h-10 w-10 text-primary/50" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
                        draft
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Draft course
                      </div>
                      
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.id}/edit`}>
                          Continue Editing
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mb-4 bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-10 w-10 text-primary/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No draft courses</h3>
                <p className="text-muted-foreground mb-6">
                  All your courses are published or you haven't created any courses yet.
                </p>
                <Button asChild>
                  <Link to="/courses/create">Create a Course</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {courses.length > 6 && (
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

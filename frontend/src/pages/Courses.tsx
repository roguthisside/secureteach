
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Filter, 
  GraduationCap, 
  Video, 
  Users, 
  Calendar 
} from 'lucide-react';
import { authService } from '@/utils/auth';
import { courseService, enrollmentService, type Course } from '@/utils/security';
import PageHeader from '@/components/PageHeader';

const Courses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const user = authService.getUser();
  
  useEffect(() => {
    const loadCourses = () => {
      try {
        setIsLoading(true);
        const allCourses = courseService.getAllCourses();
        
        // Only show published courses to students
        const availableCourses = authService.isTeacher() 
          ? allCourses 
          : allCourses.filter(course => course.status === 'published');
        
        setCourses(availableCourses);
        setFilteredCourses(availableCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourses();
  }, []);
  
  useEffect(() => {
    const filterCourses = () => {
      let filtered = [...courses];
      
      // Apply category filter
      if (activeCategory !== 'all') {
        filtered = filtered.filter(course => course.category === activeCategory);
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          course => 
            course.title.toLowerCase().includes(query) || 
            course.description.toLowerCase().includes(query) ||
            course.instructor.toLowerCase().includes(query)
        );
      }
      
      setFilteredCourses(filtered);
    };
    
    filterCourses();
  }, [searchQuery, activeCategory, courses]);
  
  // Check if a user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    if (!user) return false;
    return enrollmentService.isUserEnrolled(user.id, courseId);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PageHeader title="Browse Courses" />
        
        {authService.isTeacher() && (
          <Button asChild>
            <Link to="/courses/create">Create New Course</Link>
          </Button>
        )}
      </div>
      
      {/* Search and filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filter:</span>
            <select 
              className="p-2 text-sm rounded border"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
              <option value="science">Science</option>
              <option value="language">Languages</option>
              <option value="humanities">Humanities</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Course listing */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
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
                
                {/* Status badges */}
                <div className="absolute top-2 left-2">
                  <Badge variant={course.type === 'video' ? 'secondary' : 'default'} className="mr-2">
                    {course.type === 'video' ? 'Video Course' : 'Live Sessions'}
                  </Badge>
                </div>
                
                {course.status !== 'published' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant={course.status === 'draft' ? 'outline' : 'destructive'}>
                      {course.status}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2 flex-grow">
                <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                <div className="text-sm text-muted-foreground">by {course.instructor}</div>
                <CardDescription className="line-clamp-2 mt-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{course.enrolledCount} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>{course.videos.length} lessons</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 pb-4">
                <div className="w-full flex items-center justify-between">
                  <div className="text-lg font-semibold">${course.price.toFixed(2)}</div>
                  
                  {isEnrolled(course.id) ? (
                    <Button variant="outline" asChild>
                      <Link to={`/courses/${course.id}/learn`}>
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link to={`/courses/${course.id}`}>
                        {authService.isTeacher() ? 'View Details' : 'Enroll Now'}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? 'Try adjusting your search or filters' 
              : 'There are no courses available at the moment'}
          </p>
          {authService.isTeacher() && (
            <Button asChild>
              <Link to="/courses/create">Create Your First Course</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;

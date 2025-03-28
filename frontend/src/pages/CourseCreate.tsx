
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { authService } from '@/utils/auth';
import { courseService, type CourseType } from '@/utils/security';
import PageHeader from '@/components/PageHeader';

// Form schema
const courseSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  price: z.coerce.number().min(0, { message: 'Price must be 0 or higher' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  type: z.enum(['video', 'live'], { required_error: 'Please select a course type' }),
  thumbnailUrl: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const CourseCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    },
  });
  
  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to create a course');
      }
      
      // Make sure all required fields are non-optional by adding the non-null assertion operator (!)
      const courseData = {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,
        type: values.type as CourseType,
        thumbnailUrl: values.thumbnailUrl || '/placeholder.svg',
        instructor: user.name,
        instructorId: user.id,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        status: 'draft' as const,
        enrolledCount: 0,
        topics: [],
        videos: [],
      };
      
      const newCourse = courseService.addCourse(courseData);
      toast.success('Course created successfully!');
      navigate(`/courses/${newCourse.id}/edit`);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Create New Course" />
      
      <div className="max-w-3xl mx-auto mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a compelling course title" {...field} />
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
                      className="min-h-28" 
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
            
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CourseCreate;


import { v4 as uuidv4 } from 'uuid';
import { User } from './auth';

// Course types, interfaces and service
export type CourseType = 'video' | 'live';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: CourseType;
  thumbnailUrl: string;
  instructor: string;
  instructorId: string;
  createdDate: string;
  updatedDate: string;
  status: CourseStatus;
  enrolledCount: number;
  topics: string[];
  videos: CourseVideo[];
}

export interface CourseVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  position: number;
  thumbnailUrl?: string;
  securityOptions?: SecurityOptions;
  watermarkOptions?: WatermarkOptions;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledDate: string;
  updatedAt: string;
  completedLessons: string[];
  progress: number;
  completed: boolean;
}

// Security and watermark options for videos
export interface SecurityOptions {
  preventScreenCapture: boolean;
  preventDownload: boolean;
  restrictIpAccess: boolean;
  allowedIps?: string[];
  expirationDate?: string;
  // Additional properties for compatibility with Configure.tsx
  preventScreenRecording?: boolean;
  preventScreenshots?: boolean;
  preventDownloading?: boolean;
  preventWindowSharing?: boolean;
  enableWatermarking?: boolean;
}

export interface WatermarkOptions {
  enabled: boolean;
  text?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
  size?: 'small' | 'medium' | 'large';
  includeUserInfo?: boolean;
  // Additional properties for compatibility with Configure.tsx
  includeName?: boolean;
  includeEmail?: boolean;
  includeId?: boolean;
  includeTimestamp?: boolean;
  includeCustomText?: boolean;
  customText?: string;
  isMoving?: boolean;
  movementSpeed?: 'slow' | 'medium' | 'fast';
}

export const defaultSecurityOptions: SecurityOptions = {
  preventScreenCapture: true,
  preventDownload: true,
  restrictIpAccess: false,
};

export const defaultWatermarkOptions: WatermarkOptions = {
  enabled: true,
  text: '© SecureTeach',
  position: 'bottom-right',
  opacity: 0.7,
  size: 'medium',
  includeUserInfo: true,
};

// Content service for managing uploaded videos
export interface VideoContent {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  uploadDate: string;
  securityOptions: SecurityOptions;
  watermarkOptions: WatermarkOptions;
  position?: number; // Added for compatibility with CourseVideo
}

class ContentService {
  private content: VideoContent[] = [];
  
  constructor() {
    this.loadContent();
  }
  
  private loadContent() {
    const savedContent = localStorage.getItem('content');
    if (savedContent) {
      this.content = JSON.parse(savedContent);
    }
  }
  
  private saveContent() {
    localStorage.setItem('content', JSON.stringify(this.content));
  }
  
  addContent(contentData: Omit<VideoContent, 'id'>): VideoContent {
    const newContent: VideoContent = {
      id: uuidv4(),
      ...contentData
    };
    
    this.content.push(newContent);
    this.saveContent();
    
    return newContent;
  }
  
  getContentById(id: string): VideoContent | undefined {
    return this.content.find(item => item.id === id);
  }
  
  updateContent(id: string, data: Partial<VideoContent>): VideoContent {
    const index = this.content.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Content not found');
    }
    
    this.content[index] = {
      ...this.content[index],
      ...data
    };
    
    this.saveContent();
    return this.content[index];
  }
  
  deleteContent(id: string): void {
    const index = this.content.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Content not found');
    }
    
    this.content.splice(index, 1);
    this.saveContent();
  }
  
  getAllContent(): VideoContent[] {
    return this.content;
  }
}

export const contentService = new ContentService();

// Course service
class CourseService {
  private courses: Course[] = [];
  private enrollments: Enrollment[] = [];
  
  constructor() {
    // Load initial data or restore from localStorage
    this.loadData();
  }
  
  private loadData() {
    const savedCourses = localStorage.getItem('courses');
    const savedEnrollments = localStorage.getItem('enrollments');
    
    if (savedCourses) {
      this.courses = JSON.parse(savedCourses);
    } else {
      // Initialize with sample data
      this.initializeSampleCourses();
    }
    
    if (savedEnrollments) {
      this.enrollments = JSON.parse(savedEnrollments);
    }
  }
  
  private saveData() {
    localStorage.setItem('courses', JSON.stringify(this.courses));
    localStorage.setItem('enrollments', JSON.stringify(this.enrollments));
  }
  
  private initializeSampleCourses() {
    // Sample courses if needed
    const sampleCourses: Course[] = [
      {
        id: uuidv4(),
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming language.',
        price: 49.99,
        category: 'programming',
        type: 'video',
        thumbnailUrl: '/placeholder.svg',
        instructor: 'John Doe',
        instructorId: 'teacher1',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        status: 'published',
        enrolledCount: 25,
        topics: ['Variables', 'Functions', 'Objects', 'DOM Manipulation'],
        videos: [
          {
            id: uuidv4(),
            title: 'Variables and Data Types',
            description: 'Learn about variables and data types in JavaScript',
            videoUrl: 'https://example.com/video1.mp4',
            duration: 15,
            position: 1
          },
          {
            id: uuidv4(),
            title: 'Functions and Scope',
            description: 'Understanding functions and scope in JavaScript',
            videoUrl: 'https://example.com/video2.mp4',
            duration: 20,
            position: 2
          }
        ]
      }
    ];
    
    this.courses = sampleCourses;
    this.saveData();
  }
  
  // Course CRUD operations
  getCourses(): Course[] {
    return this.courses;
  }
  
  getAllCourses(): Course[] {
    return this.courses;
  }
  
  getCourseById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }
  
  getTeacherCourses(teacherId: string): Course[] {
    return this.courses.filter(course => course.instructorId === teacherId);
  }
  
  getCoursesByInstructor(instructorId: string): Course[] {
    return this.courses.filter(course => course.instructorId === instructorId);
  }
  
  getEnrolledCourses(userId: string): Course[] {
    const userEnrollments = this.getEnrollments(userId);
    return userEnrollments.map(enrollment => {
      const course = this.getCourseById(enrollment.courseId);
      return course!;
    }).filter(Boolean);
  }
  
  addCourse(courseData: Omit<Course, 'id'>): Course {
    const newCourse: Course = {
      id: uuidv4(),
      ...courseData
    };
    
    this.courses.push(newCourse);
    this.saveData();
    
    return newCourse;
  }
  
  updateCourse(id: string, courseData: Partial<Course>): Course {
    const index = this.courses.findIndex(course => course.id === id);
    
    if (index === -1) {
      throw new Error('Course not found');
    }
    
    this.courses[index] = {
      ...this.courses[index],
      ...courseData,
      updatedDate: new Date().toISOString()
    };
    
    this.saveData();
    
    return this.courses[index];
  }
  
  deleteCourse(id: string): void {
    const index = this.courses.findIndex(course => course.id === id);
    
    if (index === -1) {
      throw new Error('Course not found');
    }
    
    this.courses.splice(index, 1);
    this.saveData();
  }
  
  // Video management
  addVideoToCourse(courseId: string, videoData: Omit<CourseVideo, 'id'>): Course {
    const course = this.getCourseById(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    const newVideo: CourseVideo = {
      id: uuidv4(),
      ...videoData
    };
    
    course.videos.push(newVideo);
    this.saveData();
    
    return course;
  }
  
  removeVideoFromCourse(courseId: string, videoId: string): Course {
    const course = this.getCourseById(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    const videoIndex = course.videos.findIndex(video => video.id === videoId);
    
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }
    
    course.videos.splice(videoIndex, 1);
    this.saveData();
    
    return course;
  }
  
  // Enrollment operations
  enrollUserInCourse(userId: string, courseId: string): Enrollment {
    // Check if user is already enrolled
    const existingEnrollment = this.enrollments.find(
      e => e.userId === userId && e.courseId === courseId
    );
    
    if (existingEnrollment) {
      return existingEnrollment;
    }
    
    // Check if course exists
    const course = this.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    
    const newEnrollment: Enrollment = {
      id: uuidv4(),
      userId,
      courseId,
      enrolledDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedLessons: [],
      progress: 0,
      completed: false
    };
    
    this.enrollments.push(newEnrollment);
    
    // Update course enrollment count
    course.enrolledCount += 1;
    this.updateCourse(courseId, { enrolledCount: course.enrolledCount });
    
    this.saveData();
    
    return newEnrollment;
  }
  
  getEnrollments(userId: string): Enrollment[] {
    return this.enrollments.filter(e => e.userId === userId);
  }
  
  getEnrollmentsByUser(userId: string): Enrollment[] {
    return this.enrollments.filter(e => e.userId === userId);
  }
  
  getCourseEnrollments(courseId: string): Enrollment[] {
    return this.enrollments.filter(e => e.courseId === courseId);
  }
  
  getEnrollment(userId: string, courseId: string): Enrollment | undefined {
    return this.enrollments.find(
      e => e.userId === userId && e.courseId === courseId
    );
  }
  
  isUserEnrolled(userId: string, courseId: string): boolean {
    return !!this.getEnrollment(userId, courseId);
  }
  
  getAllEnrollments(): Enrollment[] {
    return this.enrollments;
  }
  
  updateEnrollment(enrollment: Enrollment): Enrollment {
    const index = this.enrollments.findIndex(e => e.id === enrollment.id);
    
    if (index === -1) {
      throw new Error('Enrollment not found');
    }
    
    this.enrollments[index] = enrollment;
    this.saveData();
    
    return this.enrollments[index];
  }
  
  markLessonComplete(userId: string, courseId: string, lessonId: string): Enrollment {
    const allEnrollments = this.getAllEnrollments();
    const enrollment = allEnrollments.find(
      e => e.userId === userId && e.courseId === courseId
    );
    
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    
    // Add updatedAt timestamp
    enrollment.updatedAt = new Date().toISOString();
    
    // Calculate progress percentage
    const course = this.getCourseById(courseId);
    if (course) {
      const totalLessons = course.videos.length;
      enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;
      
      // Mark as completed if all lessons are done
      if (enrollment.completedLessons.length === totalLessons) {
        enrollment.completed = true;
      }
    }
    
    return this.updateEnrollment(enrollment);
  }
}

export const courseService = new CourseService();

// Enrollment service as a separate export for cleaner imports
class EnrollmentService {
  private service: CourseService;
  
  constructor(service: CourseService) {
    this.service = service;
  }
  
  enrollUserInCourse(userId: string, courseId: string): Enrollment {
    return this.service.enrollUserInCourse(userId, courseId);
  }
  
  getEnrollmentsByUser(userId: string): Enrollment[] {
    return this.service.getEnrollments(userId);
  }
  
  getCourseEnrollments(courseId: string): Enrollment[] {
    return this.service.getCourseEnrollments(courseId);
  }
  
  getEnrollment(userId: string, courseId: string): Enrollment | undefined {
    return this.service.getEnrollment(userId, courseId);
  }
  
  isUserEnrolled(userId: string, courseId: string): boolean {
    return this.service.isUserEnrolled(userId, courseId);
  }
  
  getAllEnrollments(): Enrollment[] {
    return this.service.getAllEnrollments();
  }
  
  updateEnrollment(enrollment: Enrollment): Enrollment {
    return this.service.updateEnrollment(enrollment);
  }
  
  markLessonComplete(userId: string, courseId: string, lessonId: string): Enrollment {
    return this.service.markLessonComplete(userId, courseId, lessonId);
  }
}

export const enrollmentService = new EnrollmentService(courseService);

// Function to generate secure embed code for videos
export function generateEmbedCode(
  videoId: string,
  securityOptions?: SecurityOptions,
  watermarkOptions?: WatermarkOptions
): string {
  // Apply security settings
  const security = securityOptions || defaultSecurityOptions;
  const watermark = watermarkOptions || defaultWatermarkOptions;
  
  // Generate a secure token (in a real app, this would be more sophisticated)
  const token = `token_${videoId}_${Date.now()}`;
  
  // Watermark code would be injected here in a real implementation
  let watermarkCode = '';
  if (watermark.enabled) {
    watermarkCode = `
      <div class="absolute ${watermark.position || 'bottom-right'} p-2 text-white 
      opacity-${Math.round((watermark.opacity || 0.7) * 10)} text-${watermark.size || 'sm'}">
        ${watermark.text || '© SecureTeach'}
      </div>
    `;
  }
  
  // Return an iframe with the video URL and token
  return `
    <div class="relative w-full h-full">
      <iframe 
        src="https://example.com/player/${videoId}?token=${token}" 
        width="100%" 
        height="100%" 
        frameborder="0" 
        allowfullscreen
        class="rounded-lg shadow-lg"
        ${security.preventScreenCapture ? 'data-prevent-capture="true"' : ''}
        ${security.preventDownload ? 'data-prevent-download="true"' : ''}
      ></iframe>
      ${watermarkCode}
    </div>
  `;
}

// Helper function to convert between types
export function videoContentToCourseVideo(content: VideoContent): CourseVideo {
  return {
    id: content.id,
    title: content.title,
    description: content.description,
    videoUrl: content.videoUrl,
    duration: content.duration,
    position: content.position || 0,
    thumbnailUrl: content.thumbnailUrl,
    securityOptions: content.securityOptions,
    watermarkOptions: content.watermarkOptions
  };
}

export function courseVideoToVideoContent(video: CourseVideo): VideoContent {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl || '',
    duration: video.duration,
    uploadDate: new Date().toISOString(),
    securityOptions: video.securityOptions || defaultSecurityOptions,
    watermarkOptions: video.watermarkOptions || defaultWatermarkOptions,
    position: video.position
  };
}

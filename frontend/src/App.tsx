
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Configure from "./pages/Configure";
import ContentLibrary from "./pages/ContentLibrary";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseCreate from "./pages/CourseCreate";
import CourseView from "./pages/CourseView";
import CourseDetails from "./pages/CourseDetails";
import CourseEdit from "./pages/CourseEdit";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

const queryClient = new QueryClient();

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(authService.getUser());
  
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getUser();
      setIsAuthenticated(!!currentUser);
      setUser(currentUser);
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // These routes should have the footer
  const publicRoutes = ['/', '/login', '/register', '/features', '/pricing'];
  const shouldShowFooter = (pathname: string) => {
    return publicRoutes.includes(pathname);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route 
                  path="/" 
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <>
                        <Index />
                        <Footer />
                      </>
                    )
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Public routes - accessible to all users */}
                <Route path="/features" element={
                  <>
                    <Features />
                    <Footer />
                  </>
                } />
                <Route path="/pricing" element={
                  <>
                    <Pricing />
                    <Footer />
                  </>
                } />
                
                {/* Dashboard routes - role specific */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    {user?.role === 'teacher' || user?.role === 'admin' ? (
                      <TeacherDashboard />
                    ) : (
                      <StudentDashboard />
                    )}
                  </PrivateRoute>
                } />
                
                {/* Course management routes */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/create" element={
                  <PrivateRoute requiresTeacher>
                    <CourseCreate />
                  </PrivateRoute>
                } />
                <Route path="/courses/:courseId" element={<CourseDetails />} />
                <Route path="/courses/:courseId/edit" element={
                  <PrivateRoute requiresTeacher>
                    <CourseEdit />
                  </PrivateRoute>
                } />
                <Route path="/courses/:courseId/learn" element={
                  <PrivateRoute>
                    <CourseView />
                  </PrivateRoute>
                } />
                
                {/* Content management routes */}
                <Route path="/upload" element={
                  <PrivateRoute requiresTeacher>
                    <Upload />
                  </PrivateRoute>
                } />
                <Route path="/configure/:videoId" element={
                  <PrivateRoute requiresTeacher>
                    <Configure />
                  </PrivateRoute>
                } />
                <Route path="/library" element={
                  <PrivateRoute requiresTeacher>
                    <ContentLibrary />
                  </PrivateRoute>
                } />
                
                {/* User routes */}
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

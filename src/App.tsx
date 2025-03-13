
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
  
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // These routes should have the footer
  const publicRoutes = ['/', '/login', '/register', '/features', '/pricing'];

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
                <Route 
                  path="/login" 
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <>
                        <Login />
                        <Footer />
                      </>
                    )
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <>
                        <Register />
                        <Footer />
                      </>
                    )
                  } 
                />
                
                {/* Public routes - accessible to all users */}
                <Route path="/features" element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <>
                      <Features />
                      <Footer />
                    </>
                  )
                } />
                <Route path="/pricing" element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <>
                      <Pricing />
                      <Footer />
                    </>
                  )
                } />
                
                {/* Protected routes - no footer */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/upload" element={
                  <PrivateRoute>
                    <Upload />
                  </PrivateRoute>
                } />
                <Route path="/configure/:videoId" element={
                  <PrivateRoute>
                    <Configure />
                  </PrivateRoute>
                } />
                <Route path="/library" element={
                  <PrivateRoute>
                    <ContentLibrary />
                  </PrivateRoute>
                } />
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


import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Video,
  Home,
  Library,
  User,
  Upload,
  Settings,
  DollarSign,
  Layers
} from 'lucide-react';
import { authService } from '@/utils/auth';
import { toast } from 'sonner';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    // Force refresh to ensure all auth states are updated
    window.dispatchEvent(new Event('storage'));
    navigate('/', { replace: true });
  };
  
  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect py-2 shadow-md' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-2 text-primary font-bold text-xl"
          >
            <Shield className="h-6 w-6" />
            <span className="hidden sm:inline">SecureTeach</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!isAuthenticated && (
              <>
                <Link 
                  to="/" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/features' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/pricing' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Pricing
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/dashboard' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/upload" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/upload' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Upload
                </Link>
                <Link 
                  to="/library" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/library' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Content Library
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/profile' ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  Profile
                </Link>
              </>
            ) : null}
          </nav>
          
          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                >
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                >
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {!isAuthenticated && (
              <>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <Layers className="h-5 w-5" />
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link 
                  to="/upload" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <Upload className="h-5 w-5" />
                  Upload
                </Link>
                <Link 
                  to="/library" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <Library className="h-5 w-5" />
                  Content Library
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={toggleMenu}
                >
                  <LogIn className="h-5 w-5" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={toggleMenu}
                >
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

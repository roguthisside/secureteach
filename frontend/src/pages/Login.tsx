
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, LogIn } from 'lucide-react';
import { authService, type LoginCredentials } from '@/utils/auth';
import { toast } from 'sonner';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.login(credentials);
      toast.success('Login successful');
      // Navigate to the dashboard by default
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 mt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your SecureTeach account
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="#" 
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

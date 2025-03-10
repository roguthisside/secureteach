
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">SecureTeach</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/login" className="hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-primary transition-colors">
              Register
            </Link>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {currentYear} SecureTeach. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Upload, Settings } from 'lucide-react';

const DashboardNav = () => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your secure teaching platform</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardNav;

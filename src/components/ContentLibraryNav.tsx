
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, LayoutDashboard } from 'lucide-react';

const ContentLibraryNav = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Content Library</h1>
        <p className="text-muted-foreground">Manage your secured educational videos</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload New
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ContentLibraryNav;

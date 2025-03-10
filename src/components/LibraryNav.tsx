
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';

const LibraryNav = () => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload New
        </Link>
      </Button>
    </div>
  );
};

export default LibraryNav;

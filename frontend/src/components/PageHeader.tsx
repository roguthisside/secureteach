
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  children, 
  className,
  align = 'left' 
}) => {
  return (
    <div 
      className={cn(
        'mb-8 md:mb-10',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {title}
      </h1>
      
      {description && (
        <p className="text-muted-foreground max-w-3xl mt-2">
          {description}
        </p>
      )}
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

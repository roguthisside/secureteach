
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  className,
  onClick 
}) => {
  return (
    <Card 
      className={cn(
        "border border-border hover:border-primary/50 transition-all hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

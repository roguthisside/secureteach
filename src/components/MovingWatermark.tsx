
import { useEffect, useState, useRef } from 'react';

interface MovingWatermarkProps {
  text: string;
  opacity: number;
  speed: 'slow' | 'medium' | 'fast';
  className?: string;
}

const MovingWatermark = ({ text, opacity, speed, className = '' }: MovingWatermarkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: 1, y: 1 }); // 1 for right/down, -1 for left/up
  
  // Set speed based on the prop
  const getPixelsPerFrame = () => {
    switch (speed) {
      case 'slow': return 0.5;
      case 'fast': return 2;
      case 'medium':
      default: return 1;
    }
  };
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial random position
    const container = containerRef.current;
    const maxX = container.offsetWidth - 200; // Assuming watermark width ~200px
    const maxY = container.offsetHeight - 50; // Assuming watermark height ~50px
    
    // Start at a random position
    setPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY
    });
    
    // Random initial direction
    setDirection({
      x: Math.random() > 0.5 ? 1 : -1,
      y: Math.random() > 0.5 ? 1 : -1
    });
    
    // Animation frame
    let animationFrameId: number;
    const pixelsPerFrame = getPixelsPerFrame();
    
    const animate = () => {
      setPosition(prev => {
        const container = containerRef.current;
        if (!container) return prev;
        
        const maxX = container.offsetWidth - 200;
        const maxY = container.offsetHeight - 50;
        
        let newX = prev.x + (pixelsPerFrame * direction.x);
        let newY = prev.y + (pixelsPerFrame * direction.y);
        
        // Bounce off walls
        let newDirectionX = direction.x;
        let newDirectionY = direction.y;
        
        if (newX <= 0) {
          newX = 0;
          newDirectionX = 1;
        } else if (newX >= maxX) {
          newX = maxX;
          newDirectionX = -1;
        }
        
        if (newY <= 0) {
          newY = 0;
          newDirectionY = 1;
        } else if (newY >= maxY) {
          newY = maxY;
          newDirectionY = -1;
        }
        
        if (newDirectionX !== direction.x || newDirectionY !== direction.y) {
          setDirection({
            x: newDirectionX,
            y: newDirectionY
          });
        }
        
        return { x: newX, y: newY };
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed]);
  
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      <div 
        className="absolute whitespace-nowrap bg-transparent select-none font-sans text-white mix-blend-overlay"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: opacity,
          fontSize: '14px',
          textShadow: '0 0 1px rgba(0,0,0,0.5)',
          transform: 'rotate(-15deg)',
          transition: 'left 0.1s linear, top 0.1s linear',
        }}
      >
        {text} • {currentTime}
      </div>
    </div>
  );
};

export default MovingWatermark;

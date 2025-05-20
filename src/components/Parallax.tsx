
import React, { ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // Speed factor: negative values move opposite to scroll, positive values move with scroll
  offset?: number; // Initial offset
}

export const Parallax = ({
  children,
  className,
  speed = 0.5,
  offset = 0,
}: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(offset);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const elementVisible = rect.top < windowHeight && rect.bottom > 0;
      
      if (elementVisible) {
        // Calculate how far the element is from the center of the viewport
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = elementCenter - viewportCenter;
        
        // Apply parallax effect based on distance from center and speed
        const parallax = -distanceFromCenter * speed;
        setTranslateY(offset + parallax);
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed, offset]);
  
  return (
    <div 
      ref={ref} 
      className={cn("overflow-hidden", className)}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s ease-out"
      }}
    >
      <div 
        style={{ 
          transform: `translateY(${translateY}px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Parallax;

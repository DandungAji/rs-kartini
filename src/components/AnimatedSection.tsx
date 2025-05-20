
import React, { ReactNode, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationStyle?: "fade-in" | "slide-up" | "stagger-children";
  threshold?: number;
  delay?: number;
}

export const AnimatedSection = ({
  children,
  className,
  animationStyle = "fade-in",
  threshold = 0.1,
  delay = 0,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // Unobserve after becoming visible
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin: "10px" }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay]);
  
  return (
    <div 
      ref={ref} 
      className={cn(animationStyle, { "visible": isVisible }, className)}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

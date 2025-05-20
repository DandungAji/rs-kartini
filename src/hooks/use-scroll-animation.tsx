
import { useState, useEffect, RefObject, useRef } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
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
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

export function useParallax<T extends HTMLElement>(): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const { top } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementVisible = top < windowHeight && top > -ref.current.offsetHeight;
      
      if (elementVisible) {
        // Calculate offset based on how far the element is from the center of the viewport
        const scrollPosition = top - windowHeight / 2;
        const parallaxValue = scrollPosition * 0.15; // Adjust this value to control parallax strength
        setOffset(parallaxValue);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return [ref, offset];
}

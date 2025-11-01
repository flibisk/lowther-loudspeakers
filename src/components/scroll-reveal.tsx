'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  animation = 'fade-up', 
  delay = 0,
  className = '' 
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.add('revealed');
            }, delay);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [delay]);

  const animationClass = {
    'fade-up': 'scroll-reveal-fade-up',
    'fade-in': 'scroll-reveal-fade-in',
    'slide-left': 'scroll-reveal-slide-left',
    'slide-right': 'scroll-reveal-slide-right',
    'scale': 'scroll-reveal-scale'
  }[animation];

  return (
    <div ref={elementRef} className={`${animationClass} ${className}`}>
      {children}
    </div>
  );
}


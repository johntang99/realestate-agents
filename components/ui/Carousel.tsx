'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export default function Carousel({
  children,
  autoPlay = false,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1));
  }, [children.length]);
  
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === children.length - 1 ? 0 : prev + 1));
  }, [children.length]);
  
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, goToNext]);
  
  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="min-w-full">
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {/* Arrows */}
      {showArrows && children.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </>
      )}
      
      {/* Dots */}
      {showDots && children.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                currentIndex === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

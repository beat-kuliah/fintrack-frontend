"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LazyLoadProps {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  fallback?: ReactNode;
  once?: boolean;
  onIntersect?: () => void;
}

const LazyLoad = ({
  children,
  className,
  rootMargin = "50px",
  threshold = 0.1,
  fallback,
  once = true,
  onIntersect,
}: LazyLoadProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (!hasIntersected) {
            setHasIntersected(true);
            onIntersect?.();
          }
          if (once) {
            observer.unobserve(entry.target);
          }
        } else {
          if (!once) {
            setIsIntersecting(false);
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
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
  }, [rootMargin, threshold, once, onIntersect, hasIntersected]);

  const shouldRender = once ? hasIntersected : isIntersecting;

  return (
    <div ref={ref} className={cn("lazy-load-container", className)}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazyLoad;
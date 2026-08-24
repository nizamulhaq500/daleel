'use client';

import { useEffect, useRef } from 'react';

export default function DynamicBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Media query to check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Check if it's a touch device (basic heuristic)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (prefersReducedMotion || isTouchDevice) {
      return; // Do not attach listeners if reduced motion or touch device
    }

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      
      if (bgRef.current) {
        bgRef.current.style.setProperty('--focus-x', `${currentX}px`);
        bgRef.current.style.setProperty('--focus-y', `${currentY}px`);
      }
      
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      ref={bgRef}
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020617] editorial-focus-bg"
      aria-hidden="true"
    >
      {/* Base blurred & darkened background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out base-layer"
        style={{ 
          backgroundImage: `url('/anti-hate-newspaper-wall.svg')`,
          filter: 'grayscale(60%) blur(6px) opacity(0.3) brightness(0.6)',
          transform: 'scale(1.02)'
        }}
      />
      
      {/* Dark teal overlay for the subdued palette */}
      <div className="absolute inset-0 bg-[#064e3b]/80 mix-blend-multiply" />

      {/* The focus reveal layer (sharper, slightly enlarged) */}
      <div 
        className="editorial-focus-bg__veil absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/anti-hate-newspaper-wall.svg')`,
          filter: 'grayscale(20%) opacity(0.8) brightness(1.1)',
          transform: 'scale(1.05)',
        }}
      />
      
      {/* Cursor glow */}
      <div className="editorial-focus-bg__glow absolute inset-0 mix-blend-screen" />
    </div>
  );
}

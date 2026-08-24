
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DynamicBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isLightMode, setIsLightMode] = useState(false);
  const pathname = usePathname();
  const { role } = useAuth();
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Check theme
    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('light-mode'));
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Throttled mouse move for smooth flashlight effect
    let currentX = mousePos.x;
    let currentY = mousePos.y;
    let targetX = mousePos.x;
    let targetY = mousePos.y;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Smooth interpolation (easing)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        setMousePos({ x: currentX, y: currentY });
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []); // Empty dep array so it only attaches once

  // Determine which background image based on role/path
  let bgImage = 'https://images.unsplash.com/photo-1584852956272-b5f7e4f9b88e?q=80&w=2000&auto=format&fit=crop';
  if (pathname?.includes('/dashboard/reporter')) bgImage = 'https://images.unsplash.com/photo-1577413642456-42d4f20bd5c7?q=80&w=2000&auto=format&fit=crop';
  else if (pathname?.includes('/dashboard/journalist')) bgImage = 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=2000&auto=format&fit=crop';
  else if (pathname?.includes('/dashboard/official')) bgImage = 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=2000&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020617]">
      
      {/* 1. Base Image Layer - Less blurred now so you can see it */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url('${bgImage}')`,
          filter: 'grayscale(100%) blur(5px) opacity(0.5)',
          transform: 'scale(1.02)', // Prevent blurred edges from showing
        }}
      />
      
      {/* 2. Theme Overlay (Desert/Sand for Light, Deep Greenish for Dark) */}
      <div 
        className={`absolute inset-0 mix-blend-multiply transition-colors duration-1000 ${
          isLightMode ? 'bg-[#d2b48c]/90' : 'bg-[#064e3b]/90'
        }`}
      />

      {/* 3. The Particle / Texture Overlay (Gritty film grain) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* 4. The Cursor Focus Effect - Clearer hole punch */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${bgImage}')`,
          filter: 'grayscale(0%) blur(0px) opacity(1)',
          transform: 'scale(1.02)',
          maskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.85) 0%, transparent 70%)`,
        }}
      />
      
      {/* 5. Cursor Glow (Flashlight color cast) */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${isLightMode ? 'rgba(255, 230, 180, 0.2)' : 'rgba(16, 185, 129, 0.2)'}, transparent 80%)`,
          mixBlendMode: isLightMode ? 'overlay' : 'screen',
        }}
      />
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

const PHOTOS = [
  { src: '/assets/delhi-mosque.jpg', top: '5%', left: '5%', width: '35vw', height: '40vh', rotate: '-2deg', opacity: 0.18 },
  { src: '/assets/jakarta-mosque.jpg', top: '10%', left: '45%', width: '30vw', height: '35vh', rotate: '1.5deg', opacity: 0.22 },
  { src: '/assets/praying-people.jpg', top: '50%', left: '10%', width: '40vw', height: '38vh', rotate: '3deg', opacity: 0.15 },
  { src: '/assets/flags-mosque.jpg', top: '45%', left: '60%', width: '35vw', height: '42vh', rotate: '-1.5deg', opacity: 0.20 },
  { src: '/assets/dhaka-protest.jpg', top: '80%', left: '30%', width: '42vw', height: '30vh', rotate: '2deg', opacity: 0.16 },
];

function PhotoGrid() {
  return (
    <>
      {PHOTOS.map((p, i) => (
        <img
          key={i}
          src={p.src}
          className="photo-tile absolute object-cover pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: p.width,
            height: p.height,
            transform: `rotate(${p.rotate})`,
            opacity: p.opacity,
            borderRadius: '4px'
          }}
          alt=""
        />
      ))}
    </>
  );
}

export default function DynamicBackground() {
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    
    let raf = 0;
    
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        wall.style.setProperty('--mx', `${event.clientX}px`);
        wall.style.setProperty('--my', `${event.clientY}px`);
        wall.classList.add('is-active');
      });
    };
    
    const handlePointerLeave = () => {
      wall.classList.remove('is-active');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wallRef} className="photo-wall" aria-hidden="true">
      <div className="photo-wall__blurred">
        <PhotoGrid />
      </div>
      <div className="photo-wall__sharp">
        <PhotoGrid />
      </div>
      <div className="photo-wall__veil" />
    </div>
  );
}

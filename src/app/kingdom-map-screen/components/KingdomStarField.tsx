'use client';
import React, { useEffect, useRef } from 'react';

export default function KingdomStarField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref?.current;
    if (!container) return;
    container.innerHTML = '';

    // Stars
    for (let i = 0; i < 180; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${Math.random() * 5 + 2}s;
        --delay: ${Math.random() * 6}s;
        opacity: ${Math.random() * 0.7 + 0.1};
      `;
      container?.appendChild(star);
    }

    // Nebula orbs
    const nebulas = [
      { color: 'rgba(0,212,170,0.07)', x: 15, y: 30, size: 500 },
      { color: 'rgba(245,200,66,0.05)', x: 75, y: 20, size: 400 },
      { color: 'rgba(232,93,47,0.05)', x: 60, y: 70, size: 350 },
      { color: 'rgba(124,58,237,0.07)', x: 20, y: 75, size: 450 },
      { color: 'rgba(46,204,139,0.04)', x: 85, y: 55, size: 300 },
    ];

    nebulas?.forEach((n, i) => {
      const orb = document.createElement('div');
      orb.style.cssText = `
        position: absolute;
        width: ${n?.size}px;
        height: ${n?.size}px;
        left: ${n?.x}%;
        top: ${n?.y}%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, ${n?.color} 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: float ${8 + i * 2}s ease-in-out ${i * 1.5}s infinite;
      `;
      container?.appendChild(orb);
    });
  }, []);

  return <div ref={ref} className="star-field" aria-hidden="true" />;
}
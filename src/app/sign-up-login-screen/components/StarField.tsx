'use client';
import React, { useEffect, useRef } from 'react';

const STAR_COUNT = 120;

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${Math.random() * 4 + 2}s;
        --delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
      container?.appendChild(star);
    }

    // Floating orbs
    const orbColors = [
      'rgba(0,212,170,0.06)',
      'rgba(245,200,66,0.04)',
      'rgba(232,93,47,0.04)',
      'rgba(124,58,237,0.06)',
    ];
    for (let i = 0; i < 4; i++) {
      const orb = document.createElement('div');
      const size = Math.random() * 300 + 200;
      orb.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        background: radial-gradient(circle, ${orbColors?.[i]} 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: float ${Math.random() * 6 + 8}s ease-in-out ${Math.random() * 4}s infinite;
      `;
      container?.appendChild(orb);
    }
  }, []);

  return <div ref={containerRef} className="star-field" aria-hidden="true" />;
}
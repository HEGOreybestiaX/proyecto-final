'use client';
import React, { useEffect, useRef } from 'react';

export default function LessonsStarField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref?.current;
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${Math.random() * 4 + 2}s;
        --delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
      container?.appendChild(star);
    }
  }, []);

  return <div ref={ref} className="star-field" aria-hidden="true" />;
}
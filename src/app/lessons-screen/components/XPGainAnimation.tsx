'use client';
import React, { useEffect, useState } from 'react';

interface XPGainAnimationProps {
  xp: number;
  visible: boolean;
}

export default function XPGainAnimation({ xp, visible }: XPGainAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* XP pop */}
      <div
        className="xp-font text-4xl font-bold animate-xp-pop"
        style={{
          color: '#f5c842',
          textShadow: '0 0 20px rgba(245,200,66,0.8)',
        }}
      >
        +{xp} XP ⚡
      </div>

      {/* Particles */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360;
        const distance = 80 + Math.random() * 60;
        const tx = Math.cos((angle * Math.PI) / 180) * distance;
        const ty = Math.sin((angle * Math.PI) / 180) * distance;
        const colors = ['#f5c842', '#00d4aa', '#e85d2f', '#2ecc8b', '#7c3aed'];
        const color = colors[i % colors.length];
        const size = Math.random() * 8 + 4;

        return (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 6px ${color}`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animationDelay: `${i * 0.03}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
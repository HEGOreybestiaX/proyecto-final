'use client';
import React, { useEffect, useState } from 'react';

interface NexusCharacterProps {
  mood?: 'welcome' | 'challenge' | 'login' | 'signup';
  size?: 'sm' | 'md' | 'lg';
}

const moodMessages: Record<string, string> = {
  welcome: '¿Estás listo para despertar tu mente?',
  challenge: 'El universo te espera. No te rajes.',
  login: 'De vuelta al cosmos. Bien hecho.',
  signup: 'Cada gran guerrero comienza aquí.',
};

// Pre-computed static ray angles to avoid SSR/client floating-point mismatch
const RAY_ANGLES = [0, 60, 120, 180, 240, 300];
const RAY_POINTS = RAY_ANGLES.map((angle) => ({
  angle,
  x2: parseFloat((80 + 55 * Math.cos((angle * Math.PI) / 180)).toFixed(4)),
  y2: parseFloat((80 + 55 * Math.sin((angle * Math.PI) / 180)).toFixed(4)),
  cx: parseFloat((80 + 58 * Math.cos((angle * Math.PI) / 180)).toFixed(4)),
  cy: parseFloat((80 + 58 * Math.sin((angle * Math.PI) / 180)).toFixed(4)),
}));

const ARC_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const ARC_POINTS = ARC_ANGLES.map((angle) => {
  const r = 74;
  const startAngle = (angle * Math.PI) / 180;
  const endAngle = ((angle + 30) * Math.PI) / 180;
  const x1 = parseFloat((80 + r * Math.cos(startAngle)).toFixed(4));
  const y1 = parseFloat((80 + r * Math.sin(startAngle)).toFixed(4));
  const x2 = parseFloat((80 + r * Math.cos(endAngle)).toFixed(4));
  const y2 = parseFloat((80 + r * Math.sin(endAngle)).toFixed(4));
  return { angle, r, x1, y1, x2, y2 };
});

export default function NexusCharacter({ mood = 'welcome', size = 'md' }: NexusCharacterProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [displayedMsg, setDisplayedMsg] = useState('');

  useEffect(() => {
    setVisible(false);
    const t1 = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const msg = moodMessages[mood] || moodMessages.welcome;
    setMessage(msg);
    setDisplayedMsg('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < msg.length) {
        setDisplayedMsg(msg.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [mood]);

  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
  };

  const dim = sizeMap[size];

  return (
    <div className={`flex flex-col items-center gap-4 ${visible ? 'animate-nexus-enter' : 'opacity-0'}`}>
      {/* NEXUS Avatar */}
      <div className="relative" style={{ width: dim, height: dim }}>
        {/* Outer spinning ring */}
        <svg
          className="absolute inset-0 animate-spin-slow"
          width={dim}
          height={dim}
          viewBox="0 0 160 160"
          fill="none"
        >
          <circle cx="80" cy="80" r="72" stroke="#00d4aa" strokeWidth="1" strokeDasharray="8 6" opacity="0.4" />
          <circle cx="80" cy="80" r="65" stroke="#f5c842" strokeWidth="1" strokeDasharray="4 12" opacity="0.3" />
        </svg>

        {/* Glyph rays */}
        <svg
          className="absolute inset-0"
          width={dim}
          height={dim}
          viewBox="0 0 160 160"
          fill="none"
        >
          {RAY_POINTS.map((pt, idx) => (
            <line
              key={`ray-${idx}`}
              x1="80"
              y1="80"
              x2={pt.x2}
              y2={pt.y2}
              stroke="#f5c842"
              strokeWidth="1.5"
              opacity="0.5"
              strokeLinecap="round"
            />
          ))}
          {/* Aztec chevron tips */}
          {RAY_POINTS.map((pt, idx) => (
            <polygon
              key={`tip-${idx}`}
              points={`${pt.cx},${pt.cy - 4} ${pt.cx + 4},${pt.cy + 4} ${pt.cx - 4},${pt.cy + 4}`}
              fill="#f5c842"
              opacity="0.6"
              transform={`rotate(${pt.angle}, ${pt.cx}, ${pt.cy})`}
            />
          ))}
        </svg>

        {/* Core body */}
        <div
          className="absolute inset-0 flex items-center justify-center animate-pulse-glow"
          style={{ margin: dim * 0.2 }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: dim * 0.6,
              height: dim * 0.6,
              background: 'radial-gradient(circle at 40% 35%, #00ffcc 0%, #00d4aa 40%, #006655 80%, #003333 100%)',
              boxShadow: '0 0 30px rgba(0,212,170,0.6), 0 0 60px rgba(0,212,170,0.2), inset 0 0 20px rgba(0,255,200,0.3)',
            }}
          >
            {/* Eye / iris */}
            <div
              className="rounded-full"
              style={{
                width: dim * 0.22,
                height: dim * 0.28,
                background: 'radial-gradient(ellipse, #ffffff 0%, #00ffcc 30%, #003333 70%)',
                boxShadow: '0 0 10px rgba(0,255,200,0.8)',
              }}
            />
          </div>
        </div>

        {/* Orbiting particle */}
        <div className="absolute inset-0">
          <div
            className="animate-orbit absolute"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#f5c842',
              top: '50%',
              left: '50%',
              marginTop: -4,
              marginLeft: -4,
              boxShadow: '0 0 8px rgba(245,200,66,0.8)',
            }}
          />
        </div>

        {/* Terracotta accent ring */}
        <svg
          className="absolute inset-0"
          width={dim}
          height={dim}
          viewBox="0 0 160 160"
          fill="none"
          style={{ transform: 'rotate(22.5deg)' }}
        >
          {ARC_POINTS.map((pt, idx) => (
            <path
              key={`arc-${idx}`}
              d={`M ${pt.x1} ${pt.y1} A ${pt.r} ${pt.r} 0 0 1 ${pt.x2} ${pt.y2}`}
              stroke="#e85d2f"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          ))}
        </svg>
      </div>

      {/* NEXUS label */}
      <div className="text-center">
        <div
          className="text-xs font-semibold tracking-[0.3em] uppercase"
          style={{ color: '#00d4aa' }}
        >
          NEXUS
        </div>
        <div
          className="text-xs"
          style={{ color: '#6060aa' }}
        >
          Entidad Cósmica
        </div>
      </div>

      {/* Dialogue bubble */}
      {size !== 'sm' && (
        <div
          className="nexus-dialogue px-4 py-3 max-w-xs text-center"
          style={{ minHeight: 56 }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#c0c0ee' }}>
            {displayedMsg}
            {displayedMsg.length < message.length && (
              <span style={{ color: '#00d4aa' }}>|</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
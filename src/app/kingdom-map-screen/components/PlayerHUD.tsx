'use client';

import React, { useEffect, useState } from 'react';

interface PlayerHUDProps {
  name: string;
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  avatarEmoji: string;
  completedLessons: number;
}

export default function PlayerHUD({
  name,
  level,
  xp,
  xpMax,
  streak,
  avatarEmoji,
  completedLessons,
}: PlayerHUDProps) {
  const [animatedXP, setAnimatedXP] = useState(0);
  const safeXpMax = Math.max(1, xpMax);
  const pct = Math.round((xp / safeXpMax) * 100);

  useEffect(() => {
    let start = 0;
    const step = xp / 40;
    const interval = setInterval(() => {
      start += step;
      if (start >= xp) {
        setAnimatedXP(xp);
        clearInterval(interval);
      } else {
        setAnimatedXP(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [xp]);

  return (
    <div
      className="flex items-center gap-4 rounded-2xl px-4 py-3"
      style={{
        background: 'linear-gradient(135deg, rgba(17,17,40,0.95) 0%, rgba(10,10,26,0.9) 100%)',
        border: '1px solid rgba(42,42,90,0.8)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,170,0.3) 0%, rgba(0,212,170,0.05) 100%)',
          border: '2px solid rgba(0,212,170,0.5)',
          boxShadow: '0 0 12px rgba(0,212,170,0.3)',
        }}
      >
        {avatarEmoji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="truncate text-sm font-semibold" style={{ color: '#f0f0ff' }}>
            {name}
          </span>
          <span
            className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, #f5c842, #b8900a)',
              color: '#0a0a1a',
            }}
          >
            Nv.{level}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(42,42,90,0.8)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #00d4aa, #00ffcc)',
                boxShadow: '0 0 8px rgba(0,212,170,0.6)',
              }}
            />
          </div>
          <span className="xp-font flex-shrink-0 text-xs" style={{ color: '#00d4aa' }}>
            {animatedXP.toLocaleString('es-MX')}/{safeXpMax.toLocaleString('es-MX')} XP
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.28)',
              color: '#c9b7ff',
            }}
          >
            {completedLessons} lecciones
          </span>
          <span className="text-[10px]" style={{ color: '#6060aa' }}>
            {pct}% del nivel actual
          </span>
        </div>
      </div>

      <div
        className="flex flex-shrink-0 flex-col items-center rounded-xl px-3 py-1"
        style={{
          background: 'rgba(232,93,47,0.1)',
          border: '1px solid rgba(232,93,47,0.3)',
        }}
      >
        <span className="text-lg">🔥</span>
        <span className="xp-font text-xs font-bold" style={{ color: '#e85d2f' }}>
          {streak}
        </span>
        <span className="text-xs" style={{ color: '#6060aa', fontSize: 10 }}>
          días
        </span>
      </div>
    </div>
  );
}

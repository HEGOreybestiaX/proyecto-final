'use client';

import React from 'react';

interface LessonProgressProps {
  current: number;
  total: number;
  xpEarned: number;
  lessonTitle: string;
  kingdom: string;
  kingdomColor: string;
  phase: 'content' | 'challenge';
  level: number;
  completedLessons: number;
}

export default function LessonProgress({
  current,
  total,
  xpEarned,
  lessonTitle,
  kingdom,
  kingdomColor,
  phase,
  level,
  completedLessons,
}: LessonProgressProps) {
  const safeTotal = Math.max(total, 1);
  const pct = Math.round((current / safeTotal) * 100);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(17,17,40,0.95) 0%, rgba(10,10,26,0.9) 100%)',
        border: '1px solid rgba(42,42,90,0.8)',
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="rounded-lg px-2 py-1 text-xs font-semibold"
            style={{
              background: `rgba(${kingdomColor},0.1)`,
              border: `1px solid rgba(${kingdomColor},0.3)`,
              color: `rgb(${kingdomColor})`,
            }}
          >
            {kingdom}
          </div>
          <span className="text-xs" style={{ color: '#6060aa' }}>
            {lessonTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="xp-font text-sm font-bold" style={{ color: '#f5c842' }}>
            +{xpEarned} XP
          </span>
          <span
            className="rounded-lg px-2 py-1 text-xs font-semibold"
            style={{
              background: 'rgba(0,212,170,0.08)',
              border: '1px solid rgba(0,212,170,0.2)',
              color: '#00d4aa',
            }}
          >
            Nivel {level}
          </span>
        </div>
      </div>

      <div className="mb-3 flex gap-1.5">
        {Array.from({ length: safeTotal }).map((_, index) => (
          <div
            key={`step-${index}`}
            className="h-2 flex-1 rounded-full transition-all duration-500"
            style={{
              background:
                index < current
                  ? `linear-gradient(90deg, rgb(${kingdomColor}), rgba(${kingdomColor},0.7))`
                  : index === current && phase === 'challenge'
                  ? `rgba(${kingdomColor},0.3)`
                  : '#1e1e40',
              boxShadow: index < current ? `0 0 6px rgba(${kingdomColor},0.5)` : 'none',
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span style={{ color: '#6060aa' }}>
          {phase === 'content' ? 'Estudia la lección antes del reto' : `Pregunta ${Math.min(current + 1, safeTotal)} de ${safeTotal}`}
        </span>
        <span className="font-semibold" style={{ color: `rgb(${kingdomColor})` }}>
          {phase === 'content' ? `${completedLessons} lecciones completadas` : `${pct}% completado`}
        </span>
      </div>
    </div>
  );
}

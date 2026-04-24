'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface KingdomCardProps {
  id: string;
  name: string;
  subtitle: string;
  subject: string;
  icon: string;
  color: string;
  colorRgb: string;
  secondaryColor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  xpAvailable: number;
  locked: boolean;
  lockedReason?: string;
  description: string;
  glyphs: string[];
}

export default function KingdomCard({
  id,
  name,
  subtitle,
  subject,
  icon,
  color,
  colorRgb,
  secondaryColor,
  progress,
  totalLessons,
  completedLessons,
  xpAvailable,
  locked,
  lockedReason,
  description,
  glyphs,
}: KingdomCardProps) {
  const router = useRouter();
  const [isEntering, setIsEntering] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    if (locked) {
      toast.error(`🔒 ${lockedReason || 'Este reino aún no está disponible'}`);
      return;
    }
    setIsEntering(true);
    toast.success(`🌌 Entrando al ${name}…`);
    // Backend integration: POST /api/progress/kingdom-enter { kingdomId: id }
    setTimeout(() => {
      router.push(`/lessons-screen?kingdom=${id}`);
    }, 800);
  };

  return (
    <div
      className={`kingdom-portal relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${locked ? 'locked' : ''}`}
      onMouseEnter={() => !locked && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
      aria-label={`${locked ? 'Bloqueado: ' : ''}${name} — ${subject}`}
      style={{
        background: locked
          ? 'linear-gradient(135deg, #0d0d20 0%, #0a0a1a 100%)'
          : `linear-gradient(135deg, rgba(${colorRgb},0.12) 0%, rgba(17,17,40,0.95) 60%, rgba(10,10,26,0.98) 100%)`,
        border: `1px solid ${locked ? '#1a1a35' : hovered ? color : `rgba(${colorRgb},0.3)`}`,
        boxShadow: hovered && !locked ? `0 0 40px rgba(${colorRgb},0.2), 0 8px 32px rgba(0,0,0,0.5)` : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {/* Glyph pattern background */}
      {!locked && (
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 20px)`,
          }}
        />
      )}

      {/* Portal glow effect */}
      {!locked && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(${colorRgb},0.15) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0.5,
          }}
        />
      )}

      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 rounded-2xl">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
            style={{ background: 'rgba(42,42,90,0.8)', border: '1px solid #2a2a5a' }}
          >
            <span className="text-2xl">🔒</span>
          </div>
          {lockedReason && (
            <p className="text-xs text-center px-4" style={{ color: '#4040aa' }}>
              {lockedReason}
            </p>
          )}
        </div>
      )}

      <div className={`relative p-5 ${locked ? 'opacity-30' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-transform duration-300"
            style={{
              background: `radial-gradient(circle, rgba(${colorRgb},0.3) 0%, rgba(${colorRgb},0.05) 100%)`,
              border: `1px solid rgba(${colorRgb},0.4)`,
              boxShadow: hovered ? `0 0 20px rgba(${colorRgb},0.4)` : 'none',
              transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            {icon}
          </div>

          <div className="text-right">
            <div
              className="text-xs font-semibold px-2 py-1 rounded-full mb-1"
              style={{
                background: `rgba(${colorRgb},0.1)`,
                border: `1px solid rgba(${colorRgb},0.3)`,
                color: color,
              }}
            >
              {subject}
            </div>
            <div className="xp-font text-xs" style={{ color: '#6060aa' }}>
              +{xpAvailable.toLocaleString('es-MX')} XP
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h3 className="font-bold text-lg leading-tight" style={{ color: '#f0f0ff' }}>
            {name}
          </h3>
          <p className="text-xs font-medium" style={{ color: color }}>
            {subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-4" style={{ color: '#7070aa' }}>
          {description}
        </p>

        {/* Glyphs */}
        <div className="flex gap-1.5 mb-4">
          {glyphs.map((glyph, gi) => (
            <span
              key={`glyph-${id}-${gi}`}
              className="text-sm px-2 py-0.5 rounded-lg"
              style={{
                background: `rgba(${colorRgb},0.08)`,
                border: `1px solid rgba(${colorRgb},0.2)`,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>

        {/* Progress */}
        {!locked && (
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs">
              <span style={{ color: '#7070aa' }}>
                {completedLessons}/{totalLessons} lecciones
              </span>
              <span className="xp-font font-semibold" style={{ color: color }}>
                {progress}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(42,42,90,0.6)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${color}, ${secondaryColor})`,
                  boxShadow: `0 0 8px rgba(${colorRgb},0.6)`,
                }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        {!locked && (
          <button
            className="btn-cosmic w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: isEntering
                ? `rgba(${colorRgb},0.3)`
                : hovered
                ? `linear-gradient(135deg, ${color} 0%, ${secondaryColor} 100%)`
                : `rgba(${colorRgb},0.1)`,
              border: `1px solid rgba(${colorRgb},0.4)`,
              color: hovered ? '#0a0a1a' : color,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
          >
            {isEntering ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
                Abriendo portal…
              </>
            ) : completedLessons > 0 ? (
              '⚡ Continuar Aventura'
            ) : (
              '🚀 Iniciar Reino'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
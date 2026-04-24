'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSpeech } from '@/hooks/useSpeech';

interface LessonCompleteModalProps {
  visible: boolean;
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  lessonTitle: string;
  level: number;
  hasNextLesson: boolean;
  onClose: () => void;
}

export default function LessonCompleteModal({
  visible,
  xpEarned,
  correctAnswers,
  totalQuestions,
  lessonTitle,
  level,
  hasNextLesson,
  onClose,
}: LessonCompleteModalProps) {
  const router = useRouter();
  const [animatedXP, setAnimatedXP] = useState(0);
  const { speak } = useSpeech({ rate: 0.9, pitch: 0.85 });

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Auto-read feedback when modal opens
  useEffect(() => {
    if (!visible) return;
    const msg = accuracy >= 80
      ? `¡Lección completada! Obtuviste ${xpEarned} puntos de experiencia. ¡Excelente trabajo, guerrero!`
      : `Lección completada. Ganaste ${xpEarned} puntos de experiencia. Sigue practicando para mejorar tu precisión.`;
    const timer = setTimeout(() => speak(msg), 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setAnimatedXP(0);
      return;
    }

    let current = 0;
    const step = Math.max(1, xpEarned / 50);
    const interval = setInterval(() => {
      current += step;
      if (current >= xpEarned) {
        setAnimatedXP(xpEarned);
        clearInterval(interval);
      } else {
        setAnimatedXP(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [visible, xpEarned]);

  if (!visible) return null;

  const grade =
    accuracy >= 90 ? { label: 'MAESTRO CÓSMICO', color: '#f5c842', icon: '👑' }
    : accuracy >= 70 ? { label: 'GUERRERO CAPAZ', color: '#00d4aa', icon: '⚡' }
    : accuracy >= 50 ? { label: 'APRENDIZ VALIENTE', color: '#7c3aed', icon: '🌱' }
    : { label: 'SIGUE INTENTANDO', color: '#e85d2f', icon: '🔥' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,15,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-sm animate-slide-up"
        style={{
          background: 'linear-gradient(135deg, #111128 0%, #0a0a1a 100%)',
          border: '1px solid rgba(245,200,66,0.3)',
          borderRadius: 24,
          boxShadow: '0 0 60px rgba(245,200,66,0.15)',
          overflow: 'hidden',
        }}
      >
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #f5c842, #e85d2f, #00d4aa)' }} />

        <div className="space-y-5 p-6">
          <div className="space-y-2 text-center">
            <div className="mb-2 text-5xl">{grade.icon}</div>
            <div className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: grade.color }}>
              {grade.label}
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#f0f0ff' }}>
              ¡Lección completada!
            </h3>
            <p className="text-sm" style={{ color: '#6060aa' }}>
              {lessonTitle}
            </p>
          </div>

          <div
            className="rounded-2xl py-4 text-center"
            style={{
              background: 'rgba(245,200,66,0.08)',
              border: '1px solid rgba(245,200,66,0.25)',
            }}
          >
            <p className="mb-1 text-xs" style={{ color: '#8080aa' }}>XP ganado</p>
            <p
              className="xp-font text-4xl font-bold"
              style={{
                color: '#f5c842',
                textShadow: '0 0 20px rgba(245,200,66,0.6)',
              }}
            >
              +{animatedXP.toLocaleString('es-MX')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Correctas', value: `${correctAnswers}/${totalQuestions}`, color: '#2ecc8b', icon: '✓' },
              { label: 'Precisión', value: `${accuracy}%`, color: '#00d4aa', icon: '🎯' },
              { label: 'Nivel', value: `Nv. ${level}`, color: '#7c3aed', icon: '⭐' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: 'rgba(17,17,40,0.8)',
                  border: '1px solid #1e1e40',
                }}
              >
                <div className="mb-0.5 text-lg">{stat.icon}</div>
                <div className="xp-font text-sm font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: '#5050aa', fontSize: 10 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-3"
            style={{
              background: 'rgba(0,212,170,0.06)',
              border: '1px solid rgba(0,212,170,0.2)',
            }}
          >
            <p className="text-xs leading-relaxed" style={{ color: '#a0a0cc' }}>
              <span style={{ color: '#00d4aa' }}>NEXUS: </span>
              {accuracy >= 80
                ? 'Impresionante. Tu progreso ya se guardó y el cosmos reconoce tu poder.'
                : accuracy >= 50
                ? 'Buen intento. Tu avance quedó registrado; vuelve a practicar y sube tu precisión.'
                : 'Cada error también cuenta como aprendizaje. Tu progreso quedó guardado para seguir avanzando.'}
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => router.push('/kingdom-map-screen')}
              className="btn-cosmic w-full rounded-xl py-3.5 text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #00d4aa 0%, #006655 100%)',
                color: '#0a0a1a',
                boxShadow: '0 0 20px rgba(0,212,170,0.3)',
              }}
            >
              🗺️ Volver al mapa de reinos
            </button>
            <button
              onClick={onClose}
              className="btn-cosmic w-full rounded-xl py-3 text-sm font-semibold"
              style={{
                background: 'rgba(17,17,40,0.8)',
                border: '1px solid #2a2a5a',
                color: '#a0a0cc',
              }}
            >
              {hasNextLesson ? '⚡ Siguiente lección' : '🏁 Finalizar reino'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

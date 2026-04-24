'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PlayerHUD from './PlayerHUD';
import KingdomCard from './KingdomCard';
import NexusTipPanel from './NexusTipPanel';
import { DAILY_CHALLENGES, getKingdomState, KINGDOMS } from '@/lib/nexus-data';
import { ensurePlayerProfile, getLevelStats, getTotalCompletedLessons, readPlayerProfile } from '@/lib/nexus-progress';

export default function KingdomMapClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [playerProfile, setPlayerProfile] = useState<ReturnType<typeof ensurePlayerProfile> | null>(null);

  useEffect(() => {
    setMounted(true);
    const profile = readPlayerProfile() ?? ensurePlayerProfile();
    setPlayerProfile(profile);

    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Sync HUD when returning from a lesson (window focus or visibility change)
  useEffect(() => {
    const handleFocus = () => {
      const refreshed = readPlayerProfile();
      if (refreshed) setPlayerProfile(refreshed);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const refreshed = readPlayerProfile();
        if (refreshed) setPlayerProfile(refreshed);
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const levelStats = useMemo(() => getLevelStats(playerProfile?.xp ?? 0), [playerProfile?.xp]);
  const totalCompletedLessons = getTotalCompletedLessons(playerProfile);
  const totalLessons = KINGDOMS.reduce((sum, kingdom) => sum + kingdom.totalLessons, 0);

  const kingdomCards = useMemo(
    () =>
      KINGDOMS.map((kingdom) => ({
        ...kingdom,
        ...getKingdomState(playerProfile ?? ensurePlayerProfile(), kingdom),
      })),
    [playerProfile]
  );

  const handleDailyChallenge = (challengeId: string) => {
    const challenge = DAILY_CHALLENGES.find((item) => item.id === challengeId);
    if (!challenge) return;

    setSelectedChallenge(challengeId);
    toast.success('🎯 Reto diario activado. NEXUS preparó un desafío especial.');

    setTimeout(() => {
      router.push(`/lessons-screen?kingdom=${challenge.kingdomId}&challenge=${challenge.id}`);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {mounted && showWelcome && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500"
          style={{
            background: 'rgba(5,5,15,0.92)',
            backdropFilter: 'blur(8px)',
            opacity: showWelcome ? 1 : 0,
          }}
        >
          <div className="animate-slide-up space-y-4 text-center">
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background: 'radial-gradient(circle, #00ffcc 0%, #00d4aa 50%, #003333 100%)',
                boxShadow: '0 0 40px rgba(0,212,170,0.6)',
              }}
            >
              <div className="rounded-full" style={{ width: 20, height: 28, background: 'rgba(255,255,255,0.9)' }} />
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.3em]" style={{ color: '#00d4aa' }}>NEXUS</p>
              <h2 className="text-3xl font-bold" style={{ color: '#f0f0ff' }}>
                ¡Bienvenido de vuelta,
                <br />
                {playerProfile?.name}!
              </h2>
              <p className="mt-2 text-sm" style={{ color: '#8080bb' }}>
                {playerProfile?.streak} días de racha 🔥 · el cosmos te sonríe
              </p>
              <p className="mt-3 text-xs leading-relaxed max-w-xs" style={{ color: '#6060aa' }}>
                El aprendizaje se convierte en un juego interactivo. ¡Explora los reinos y sube de nivel!
              </p>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="btn-cosmic rounded-xl px-6 py-3 text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, #00d4aa, #006655)',
                color: '#0a0a1a',
              }}
            >
              Explorar el mapa →
            </button>
          </div>
        </div>
      )}

      <div className="animate-slide-up px-4 pb-2 pt-4 md:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: 'radial-gradient(circle, #00ffcc 0%, #00d4aa 50%, #006655 100%)',
                  boxShadow: '0 0 16px rgba(0,212,170,0.5)',
                }}
              >
                <div className="rounded-full" style={{ width: 8, height: 10, background: 'rgba(255,255,255,0.9)' }} />
              </div>
              <div>
                <span
                  className="bg-clip-text text-lg font-bold tracking-tight text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #00ffcc, #f5c842)',
                  }}
                >
                  NEXUS
                </span>
                <p className="text-xs" style={{ color: '#4040aa', lineHeight: 1 }}>Mapa de Reinos</p>
              </div>
            </div>

            <div className="max-w-sm flex-1">
              {playerProfile && (
                <PlayerHUD
                  name={playerProfile.name}
                  level={levelStats.level}
                  xp={levelStats.currentLevelXP}
                  xpMax={levelStats.xpForNextLevel}
                  streak={playerProfile.streak}
                  avatarEmoji={playerProfile.avatarEmoji}
                  completedLessons={totalCompletedLessons}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/teacher-mode')}
                className="btn-cosmic rounded-xl px-3 py-2.5 text-sm"
                style={{
                  background: 'rgba(245,200,66,0.08)',
                  border: '1px solid rgba(245,200,66,0.22)',
                  color: '#f5c842',
                }}
              >
                🧑‍🏫 Modo Maestro
              </button>
              <button
                onClick={() => router.push('/sign-up-login-screen')}
                className="btn-cosmic rounded-xl p-2.5 text-sm"
                style={{
                  background: 'rgba(17,17,40,0.8)',
                  border: '1px solid #2a2a5a',
                  color: '#6060aa',
                }}
                aria-label="Salir"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 md:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="flex-1">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #2a2a5a, transparent)' }} />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: '#6060aa' }}>
                    🗺️ Mapa de Reinos
                  </span>
                </div>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #2a2a5a)' }} />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {kingdomCards.filter((kingdom) => !kingdom.locked).map((kingdom) => (
                  <KingdomCard key={kingdom.id} {...kingdom} />
                ))}
              </div>

              <div className="mb-3">
                <p className="mb-3 text-xs uppercase tracking-[0.2em]" style={{ color: '#3a3a6a' }}>
                  🔒 Próximos Reinos
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {kingdomCards.filter((kingdom) => kingdom.locked).map((kingdom) => (
                    <KingdomCard key={kingdom.id} {...kingdom} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 xl:w-72">
              <NexusTipPanel />

              <div
                className="space-y-3 rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,200,66,0.07) 0%, rgba(17,17,40,0.95) 100%)',
                  border: '1px solid rgba(245,200,66,0.2)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#f5c842' }}>Retos de Hoy</p>
                    <p className="text-xs" style={{ color: '#6060aa' }}>Actívalos para entrar directo al desafío.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {DAILY_CHALLENGES.map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => handleDailyChallenge(challenge.id)}
                      className="btn-cosmic w-full rounded-xl p-3 text-left transition-all duration-200"
                      style={{
                        background: selectedChallenge === challenge.id ? 'rgba(245,200,66,0.15)' : 'rgba(17,17,40,0.8)',
                        border: `1px solid ${selectedChallenge === challenge.id ? 'rgba(245,200,66,0.5)' : '#1e1e40'}`,
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 text-base">{challenge.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate" style={{ color: '#d0d0ee' }}>{challenge.text}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#6060aa' }}>+{challenge.xp} XP · {challenge.kingdom}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

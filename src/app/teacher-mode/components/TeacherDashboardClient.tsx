'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildTeacherRoster, KINGDOMS } from '@/lib/nexus-data';
import type { PlayerProfile } from '@/lib/nexus-progress';
import { readPlayerProfile } from '@/lib/nexus-progress';

function getStatusColor(status: string) {
  if (status === 'Destacado' || status === 'Destacada') return '#f5c842';
  if (status === 'Constante' || status === 'En progreso') return '#00d4aa';
  if (status === 'Nuevo') return '#7c3aed';
  return '#e85d2f';
}

export default function TeacherDashboardClient() {
  const router = useRouter();
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    setPlayerProfile(readPlayerProfile());
  }, []);

  const roster = useMemo(() => buildTeacherRoster(playerProfile), [playerProfile]);

  const metrics = useMemo(() => {
    const totalStudents = roster.length;
    const totalXP = roster.reduce((sum, student) => sum + student.xp, 0);
    const totalLessons = roster.reduce((sum, student) => sum + student.completedLessons, 0);
    const topStreak = roster.reduce((max, student) => Math.max(max, student.streak), 0);
    const avgAccuracy = totalStudents > 0
      ? Math.round(roster.reduce((sum, student) => sum + student.accuracy, 0) / totalStudents)
      : 0;

    return {
      totalStudents,
      avgXP: totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0,
      avgLessons: totalStudents > 0 ? (totalLessons / totalStudents).toFixed(1) : '0.0',
      topStreak,
      avgAccuracy,
    };
  }, [roster]);

  const kingdomInsights = useMemo(
    () =>
      KINGDOMS.slice(0, 4).map((kingdom, index) => {
        const activityScore = Math.max(18, 88 - index * 16 + Math.min(metrics.avgAccuracy, 12));

        return {
          id: kingdom.id,
          name: kingdom.name,
          color: kingdom.color,
          activityScore: Math.min(activityScore, 96),
          note:
            index === 0
              ? 'Mayor participación en retos históricos.'
              : index === 1
              ? 'Buen ritmo en resolución de ejercicios.'
              : index === 2
              ? 'Reino sugerido para próximas expansiones.'
              : 'Ideal para actividades de lectura guiada.',
        };
      }),
    [metrics.avgAccuracy]
  );

  const featuredStudent = roster[0] ?? {
    id: 'fallback-student',
    name: 'Sin datos',
    avatarEmoji: '🛰️',
    xp: 0,
    level: 1,
    completedLessons: 0,
    streak: 0,
    group: 'Sin grupo',
    focus: 'Pendiente',
    accuracy: 0,
    status: 'Sin actividad',
    lastSeen: 'Sin registro',
  };

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Nivel', 'XP', 'Lecciones', 'Precisión %', 'Racha días', 'Grupo', 'Estado'];
    const rows = roster.map(s =>
      [s.name, s.level, s.xp, s.completedLessons, s.accuracy, s.streak, s.group, s.status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-progreso-alumnos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => router.push('/kingdom-map-screen')}
              className="btn-cosmic mb-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
              style={{
                background: 'rgba(17,17,40,0.8)',
                border: '1px solid #2a2a5a',
                color: '#a0a0cc',
              }}
            >
              <span>←</span>
              <span>Volver al mapa</span>
            </button>
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,200,66,0.22) 0%, rgba(124,58,237,0.22) 100%)',
                  border: '1px solid rgba(245,200,66,0.25)',
                }}
              >
                🧑‍🏫
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#f5c842' }}>
                  Modo Maestro
                </p>
                <h1 className="text-3xl font-bold" style={{ color: '#f0f0ff' }}>
                  Panel escolar de Nexus
                </h1>
                <p className="text-sm" style={{ color: '#8080bb' }}>
                  Vista clara del avance de alumnos, XP, niveles y lecciones completadas.
                </p>
              </div>
            </div>
          </div>

          {/* Export + actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
            <button
              onClick={handleExportCSV}
              className="btn-cosmic inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(46,204,139,0.15) 0%, rgba(17,17,40,0.9) 100%)',
                border: '1px solid rgba(46,204,139,0.4)',
                color: '#2ecc8b',
              }}
              title="Descargar progreso de alumnos como archivo CSV"
            >
              📥 Exportar CSV
            </button>
            <p style={{ fontSize: '0.7rem', color: '#4040aa' }}>Descarga el progreso de todos los alumnos</p>
          </div>

          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: 'linear-gradient(135deg, rgba(17,17,40,0.95) 0%, rgba(10,10,26,0.9) 100%)',
              border: '1px solid rgba(42,42,90,0.8)',
              minWidth: 280,
            }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#6060aa' }}>
              Estado del curso
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#a0a0cc' }}>
                  Precisión promedio
                </p>
                <p className="xp-font text-3xl font-bold" style={{ color: '#00d4aa' }}>
                  {metrics.avgAccuracy}%
                </p>
              </div>
              <div
                className="rounded-xl px-3 py-2 text-sm font-semibold"
                style={{
                  background: 'rgba(0,212,170,0.08)',
                  border: '1px solid rgba(0,212,170,0.22)',
                  color: '#00d4aa',
                }}
              >
                Listo para demo
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Alumnos registrados', value: metrics.totalStudents, icon: '👥', color: '#00d4aa' },
            { label: 'XP promedio', value: metrics.avgXP, icon: '⚡', color: '#f5c842' },
            { label: 'Lecciones promedio', value: metrics.avgLessons, icon: '📚', color: '#7c3aed' },
            { label: 'Mejor racha', value: `${metrics.topStreak} días`, icon: '🔥', color: '#e85d2f' },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(17,17,40,0.95) 0%, rgba(10,10,26,0.9) 100%)',
                border: '1px solid rgba(42,42,90,0.8)',
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm" style={{ color: '#8080bb' }}>
                  {card.label}
                </span>
                <span className="text-xl">{card.icon}</span>
              </div>
              <p className="xp-font text-3xl font-bold" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section
            className="rounded-3xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(17,17,40,0.96) 0%, rgba(10,10,26,0.92) 100%)',
              border: '1px solid rgba(42,42,90,0.85)',
            }}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#6060aa' }}>
                  Alumnos
                </p>
                <h2 className="text-xl font-bold" style={{ color: '#f0f0ff' }}>
                  Seguimiento individual
                </h2>
              </div>
              <div
                className="rounded-xl px-3 py-2 text-xs"
                style={{
                  background: 'rgba(245,200,66,0.08)',
                  border: '1px solid rgba(245,200,66,0.2)',
                  color: '#f5c842',
                }}
              >
                Datos simulados + alumno local
              </div>
            </div>

            <div className="space-y-3">
              {roster.map((student) => (
                <article
                  key={student.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(17,17,40,0.74)',
                    border: '1px solid #1e1e40',
                  }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                        style={{
                          background: 'radial-gradient(circle, rgba(0,212,170,0.16) 0%, rgba(17,17,40,0.9) 100%)',
                          border: '1px solid rgba(0,212,170,0.24)',
                        }}
                      >
                        {student.avatarEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg" style={{ color: '#f0f0ff' }}>
                            {student.name}
                          </h3>
                          <span
                            className="rounded-full px-2 py-1 text-xs font-semibold"
                            style={{
                              background: 'rgba(124,58,237,0.14)',
                              border: '1px solid rgba(124,58,237,0.28)',
                              color: '#c9b7ff',
                            }}
                          >
                            {student.group}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: '#8080bb' }}>
                          Enfoque actual: {student.focus} · Última actividad: {student.lastSeen}
                        </p>
                      </div>
                    </div>

                    <div
                      className="rounded-xl px-3 py-2 text-sm font-semibold"
                      style={{
                        background: 'rgba(17,17,40,0.82)',
                        border: `1px solid ${getStatusColor(student.status)}55`,
                        color: getStatusColor(student.status),
                      }}
                    >
                      {student.status}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {[
                      { label: 'XP', value: student.xp.toLocaleString('es-MX'), color: '#f5c842' },
                      { label: 'Nivel', value: `Nv. ${student.level}`, color: '#00d4aa' },
                      { label: 'Lecciones', value: student.completedLessons, color: '#7c3aed' },
                      { label: 'Racha', value: `${student.streak} días`, color: '#e85d2f' },
                      { label: 'Precisión', value: `${student.accuracy}%`, color: '#2ecc8b' },
                    ].map((metric) => (
                      <div
                        key={`${student.id}-${metric.label}`}
                        className="rounded-xl p-3 text-center"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(42,42,90,0.8)',
                        }}
                      >
                        <p className="text-xs" style={{ color: '#6060aa' }}>
                          {metric.label}
                        </p>
                        <p className="xp-font mt-1 text-lg font-bold" style={{ color: metric.color }}>
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section
              className="rounded-3xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(17,17,40,0.96) 0%, rgba(10,10,26,0.92) 100%)',
                border: '1px solid rgba(42,42,90,0.85)',
              }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#6060aa' }}>
                Alumno destacado
              </p>
              <div className="mt-4 rounded-2xl p-4" style={{ background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.18)' }}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{featuredStudent.avatarEmoji}</div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: '#f0f0ff' }}>
                      {featuredStudent.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#8080bb' }}>
                      {featuredStudent.status} · {featuredStudent.group}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'XP', value: featuredStudent.xp, color: '#f5c842' },
                    { label: 'Nivel', value: featuredStudent.level, color: '#00d4aa' },
                    { label: 'Lecciones', value: featuredStudent.completedLessons, color: '#7c3aed' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(17,17,40,0.72)', border: '1px solid #1e1e40' }}>
                      <p className="text-xs" style={{ color: '#6060aa' }}>
                        {item.label}
                      </p>
                      <p className="xp-font mt-1 text-xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              className="rounded-3xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(17,17,40,0.96) 0%, rgba(10,10,26,0.92) 100%)',
                border: '1px solid rgba(42,42,90,0.85)',
              }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#6060aa' }}>
                Actividad por reino
              </p>
              <div className="mt-4 space-y-4">
                {kingdomInsights.map((insight) => (
                  <div key={insight.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span style={{ color: '#f0f0ff' }}>{insight.name}</span>
                      <span className="xp-font font-semibold" style={{ color: insight.color }}>
                        {insight.activityScore}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(42,42,90,0.7)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${insight.activityScore}%`,
                          background: `linear-gradient(90deg, ${insight.color}, rgba(255,255,255,0.85))`,
                          boxShadow: `0 0 12px ${insight.color}55`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs" style={{ color: '#8080bb' }}>
                      {insight.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

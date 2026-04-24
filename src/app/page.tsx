'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IntroScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'cta'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 900);
    const t2 = setTimeout(() => setPhase('cta'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #0d0d2b 0%, #05050f 100%)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.9;transform:scale(1.4)} }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        .intro-btn:hover { transform:scale(1.05)!important; box-shadow:0 0 60px rgba(0,212,170,0.7)!important; }
      `}</style>

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: i % 5 === 0 ? 3 : 1.5, height: i % 5 === 0 ? 3 : 1.5,
            background: i % 7 === 0 ? '#f5c842' : i % 3 === 0 ? '#00d4aa' : '#fff',
            left: `${(i * 137.508) % 100}%`, top: `${(i * 91.3) % 100}%`,
            opacity: 0.2 + (i % 5) * 0.12,
            animation: `twinkle ${2 + (i % 4) * 0.7}s ease-in-out infinite`,
            animationDelay: `${(i % 10) * 0.3}s`,
          }} />
        ))}
      </div>

      {/* Orb */}
      <div style={{
        position: 'relative', marginBottom: '2.5rem',
        animation: 'float 4s ease-in-out infinite',
        opacity: phase === 'logo' ? 0 : 1,
        transform: phase === 'logo' ? 'scale(0.6)' : 'scale(1)',
        transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {[1, 2, 3].map((r) => (
          <div key={r} style={{
            position: 'absolute', inset: '-8px', borderRadius: '50%',
            border: '1px solid rgba(0,212,170,0.4)',
            animation: 'pulse-ring 2.4s ease-out infinite',
            animationDelay: `${r * 0.6}s`,
          }} />
        ))}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #00ffcc 0%, #00d4aa 50%, #003d33 100%)',
          boxShadow: '0 0 60px rgba(0,212,170,0.7),0 0 120px rgba(0,212,170,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 30, height: 40, borderRadius: 6, background: 'rgba(255,255,255,0.95)', boxShadow: '0 0 20px rgba(255,255,255,0.5)' }} />
        </div>
      </div>

      {/* Title */}
      <div style={{
        opacity: phase === 'logo' ? 0 : 1,
        transform: phase === 'logo' ? 'translateY(20px)' : 'translateY(0)',
        transition: 'all 0.7s ease',
        textAlign: 'center', marginBottom: '1rem',
      }}>
        <h1 style={{
          fontSize: 'clamp(3rem,10vw,5.5rem)', fontWeight: 900, letterSpacing: '0.2em',
          background: 'linear-gradient(135deg,#00ffcc 0%,#f5c842 50%,#00d4aa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          lineHeight: 1, margin: 0, fontFamily: 'DM Sans,sans-serif',
        }}>NEXUS</h1>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: '#00d4aa', marginTop: '0.5rem', fontFamily: 'DM Sans,sans-serif', textTransform: 'uppercase' }}>
          Aprende · Sube de nivel · Conquista
        </p>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: phase !== 'logo' ? 1 : 0,
        transform: phase !== 'logo' ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.7s ease 0.1s',
        textAlign: 'center', maxWidth: 520, marginBottom: '3rem', padding: '0 1rem',
      }}>
        <p style={{ fontSize: 'clamp(1rem,3vw,1.25rem)', color: '#d0d0f0', lineHeight: 1.6, fontFamily: 'DM Sans,sans-serif' }}>
          Bienvenido a{' '}
          <span style={{ color: '#f5c842', fontWeight: 700 }}>Nexus</span>, una experiencia donde el{' '}
          <span style={{ color: '#00d4aa', fontWeight: 600 }}>aprendizaje</span>{' '}
          se convierte en un{' '}
          <span style={{ color: '#7c3aed', fontWeight: 600 }}>juego interactivo</span>.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#6060aa', marginTop: '0.75rem', fontFamily: 'DM Sans,sans-serif' }}>
          Historia · Matemáticas · Biología · Español y más
        </p>
      </div>

      {/* CTA */}
      <div style={{
        opacity: phase === 'cta' ? 1 : 0,
        transform: phase === 'cta' ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.6s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      }}>
        <button
          className="intro-btn"
          onClick={() => router.push('/sign-up-login-screen')}
          style={{
            padding: '1rem 3rem', borderRadius: 16, border: 'none',
            background: 'linear-gradient(135deg,#00d4aa 0%,#006655 100%)',
            color: '#0a0a1a', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
            letterSpacing: '0.05em', boxShadow: '0 0 40px rgba(0,212,170,0.5)',
            fontFamily: 'DM Sans,sans-serif', transition: 'transform 0.2s,box-shadow 0.2s',
          }}
        >
          🚀 Comenzar aventura
        </button>
        <p style={{ fontSize: '0.75rem', color: '#3a3a6a', fontFamily: 'DM Sans,sans-serif' }}>
          Tu progreso se guarda automáticamente
        </p>
      </div>

      {/* Bottom glyphs */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: '2rem',
        opacity: 0.2, fontSize: '1.5rem', pointerEvents: 'none',
      }}>
        {['⏳', '🔢', '🧬', '📖', '🌌'].map((g) => <span key={g}>{g}</span>)}
      </div>
    </main>
  );
}

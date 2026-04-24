'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import NexusCharacter from './NexusCharacter';
import AvatarPicker from './AvatarPicker';
import { authenticateMockAccount, DEMO_EMAIL, DEMO_PASSWORD, registerMockAccount } from '@/lib/nexus-auth';
import { AVATARS } from '@/lib/nexus-data';

type AuthMode = 'intro' | 'login' | 'signup';

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function copyToClipboard(value: string, successMessage: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    toast.error('No fue posible copiar desde este navegador');
    return;
  }

  navigator.clipboard.writeText(value)
    .then(() => toast.success(successMessage))
    .catch(() => toast.error('No fue posible copiar el dato'));
}

export default function AuthContainer() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('intro');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-sol');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  const loginForm = useForm<LoginFormData>({ mode: 'onBlur' });
  const signupForm = useForm<SignupFormData>({ mode: 'onBlur' });

  const fillDemoCredentials = () => {
    loginForm.setValue('email', DEMO_EMAIL);
    loginForm.setValue('password', DEMO_PASSWORD);
    toast.success('Credenciales demo cargadas ✨');
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const profile = authenticateMockAccount(data.email, data.password);

    if (!profile) {
      toast.error('Credenciales inválidas. Usa la cuenta demo o la que acabas de registrar.');
      loginForm.setError('email', { message: 'Email o contraseña incorrectos' });
      setIsLoading(false);
      return;
    }

    toast.success(`¡Bienvenido de vuelta, ${profile.name}! 🌌`);
    setTimeout(() => router.push('/kingdom-map-screen'), 700);
    setIsLoading(false);
  };

  const handleSignup = async (data: SignupFormData) => {
    if (signupStep === 1) {
      const isValid = await signupForm.trigger(['name', 'email', 'password', 'confirmPassword']);
      if (!isValid) return;
      setSignupStep(2);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const avatar = AVATARS.find((item) => item.id === selectedAvatar);

    registerMockAccount({
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: selectedAvatar,
      avatarEmoji: avatar?.emoji || '⚡',
    });

    toast.success(`¡Bienvenido al cosmos, ${data.name}! NEXUS te guiará. ⚡`);
    setTimeout(() => router.push('/kingdom-map-screen'), 800);
    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 animate-slide-up text-center">
        <div
          className="mb-4 inline-flex items-center gap-3 rounded-full px-4 py-2"
          style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: '#00d4aa' }}>
            Plataforma de Aprendizaje Cósmico
          </span>
        </div>
        <h1
          className="mb-1 text-5xl font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #00ffcc 0%, #00d4aa 40%, #f5c842 80%, #e85d2f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          NEXUS
        </h1>
        <p className="text-sm" style={{ color: '#6060aa' }}>
          Historia · Matemáticas · Cosmos
        </p>
      </div>

      {mode === 'intro' && (
        <div className="animate-slide-up space-y-6" style={{ animationDelay: '0.1s' }}>
          <NexusCharacter mood="welcome" size="lg" />

          <div
            className="rounded-2xl px-6 py-4 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(17,17,40,0.9) 0%, rgba(10,10,26,0.8) 100%)',
              border: '1px solid rgba(42,42,90,0.8)',
            }}
          >
            <p className="mb-2 text-2xl font-bold" style={{ color: '#f0f0ff' }}>
              Tu mente está por despertar…
            </p>
            <p className="text-sm" style={{ color: '#8080bb' }}>
              Una aventura cósmica con esencia mexicana te espera.
              <br />
              Historia y Matemáticas nunca fueron así.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #2a2a5a)' }} />
            <div className="flex gap-1">
              {['◆', '◇', '◆'].map((symbol, index) => (
                <span key={`diamond-${index}`} className="text-xs" style={{ color: '#f5c842', opacity: 0.6 }}>
                  {symbol}
                </span>
              ))}
            </div>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #2a2a5a, transparent)' }} />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setMode('signup')}
              className="btn-cosmic w-full rounded-2xl py-4 text-base font-bold"
              style={{
                background: 'linear-gradient(135deg, #00d4aa 0%, #006655 100%)',
                color: '#0a0a1a',
                boxShadow: '0 0 30px rgba(0,212,170,0.4)',
              }}
            >
              ⚡ Comenzar mi viaje
            </button>
            <button
              onClick={() => setMode('login')}
              className="btn-cosmic w-full rounded-2xl py-3 text-sm font-semibold"
              style={{
                background: 'rgba(17,17,40,0.8)',
                border: '1px solid #2a2a5a',
                color: '#a0a0cc',
              }}
            >
              Ya tengo cuenta · Entrar
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '2', label: 'Reinos', icon: '🏰', color: '#00d4aa' },
              { value: '3', label: 'Lecciones activas', icon: '📚', color: '#f5c842' },
              { value: '∞', label: 'XP por ganar', icon: '⚡', color: '#e85d2f' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: 'rgba(17,17,40,0.6)',
                  border: '1px solid #1e1e40',
                }}
              >
                <div className="mb-0.5 text-xl">{stat.icon}</div>
                <div className="xp-font text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: '#6060aa' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'login' && (
        <div className="animate-slide-up space-y-5">
          <div className="mb-6 flex items-center gap-4">
            <NexusCharacter mood="login" size="sm" />
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#f0f0ff' }}>
                Regresa al cosmos
              </h2>
              <p className="text-sm" style={{ color: '#6060aa' }}>
                NEXUS te ha estado esperando.
              </p>
            </div>
          </div>

          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-medium" style={{ color: '#a0a0cc' }}>
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="guerrero@nexus.mx"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(17,17,40,0.8)',
                  border: `1px solid ${loginForm.formState.errors.email ? '#e85d2f' : '#2a2a5a'}`,
                  color: '#f0f0ff',
                }}
                onFocus={(event) => { event.currentTarget.style.borderColor = '#00d4aa'; }}
                onBlur={(event) => { event.currentTarget.style.borderColor = loginForm.formState.errors.email ? '#e85d2f' : '#2a2a5a'; }}
                {...loginForm.register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
                })}
              />
              {loginForm.formState.errors.email && (
                <p className="text-xs" style={{ color: '#e85d2f' }}>
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-sm font-medium" style={{ color: '#a0a0cc' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(17,17,40,0.8)',
                    border: `1px solid ${loginForm.formState.errors.password ? '#e85d2f' : '#2a2a5a'}`,
                    color: '#f0f0ff',
                  }}
                  onFocus={(event) => { event.currentTarget.style.borderColor = '#00d4aa'; }}
                  onBlur={(event) => { event.currentTarget.style.borderColor = loginForm.formState.errors.password ? '#e85d2f' : '#2a2a5a'; }}
                  {...loginForm.register('password', { required: 'La contraseña es obligatoria' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: '#6060aa' }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs" style={{ color: '#e85d2f' }}>
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-cosmic flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold"
              style={{
                background: isLoading ? 'rgba(0,212,170,0.3)' : 'linear-gradient(135deg, #00d4aa 0%, #006655 100%)',
                color: '#0a0a1a',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  </svg>
                  Abriendo el cosmos…
                </>
              ) : (
                '🌌 Entrar al cosmos'
              )}
            </button>
          </form>

          <div
            className="space-y-2 rounded-xl p-4"
            style={{
              background: 'rgba(245,200,66,0.05)',
              border: '1px solid rgba(245,200,66,0.2)',
            }}
          >
            <p className="text-xs font-semibold" style={{ color: '#f5c842' }}>
              🔑 Cuenta Demo
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs" style={{ color: '#6060aa' }}>Email: </span>
                  <span className="font-mono text-xs" style={{ color: '#a0a0cc' }}>{DEMO_EMAIL}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(DEMO_EMAIL, 'Email copiado')}
                  className="rounded px-2 py-1 text-xs"
                  style={{ color: '#f5c842', background: 'rgba(245,200,66,0.1)' }}
                >
                  Copiar
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs" style={{ color: '#6060aa' }}>Pass: </span>
                  <span className="font-mono text-xs" style={{ color: '#a0a0cc' }}>{DEMO_PASSWORD}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(DEMO_PASSWORD, 'Contraseña copiada')}
                  className="rounded px-2 py-1 text-xs"
                  style={{ color: '#f5c842', background: 'rgba(245,200,66,0.1)' }}
                >
                  Copiar
                </button>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="btn-cosmic w-full rounded-lg py-2 text-xs font-semibold"
                style={{
                  background: 'rgba(245,200,66,0.1)',
                  border: '1px solid rgba(245,200,66,0.3)',
                  color: '#f5c842',
                }}
              >
                ⚡ Autocompletar credenciales
              </button>
            </div>
          </div>

          <div className="text-center">
            <button type="button" onClick={() => setMode('intro')} className="text-sm" style={{ color: '#6060aa' }}>
              ← Volver
            </button>
            <span className="mx-3" style={{ color: '#2a2a5a' }}>·</span>
            <button type="button" onClick={() => setMode('signup')} className="text-sm" style={{ color: '#00d4aa' }}>
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </div>
      )}

      {mode === 'signup' && (
        <div className="animate-slide-up space-y-5">
          <div className="mb-6 flex items-center gap-4">
            <NexusCharacter mood="signup" size="sm" />
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#f0f0ff' }}>
                {signupStep === 1 ? 'Crea tu identidad' : 'Elige tu avatar'}
              </h2>
              <p className="text-sm" style={{ color: '#6060aa' }}>
                {signupStep === 1 ? 'Paso 1 de 2 · Datos básicos' : 'Paso 2 de 2 · Tu forma cósmica'}
              </p>
            </div>
          </div>

          <div className="mb-2 flex gap-2">
            {[1, 2].map((step) => (
              <div
                key={step}
                className="h-1.5 flex-1 rounded-full transition-all duration-500"
                style={{
                  background: signupStep >= step ? 'linear-gradient(90deg, #00d4aa, #00ffcc)' : '#1e1e40',
                }}
              />
            ))}
          </div>

          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            {signupStep === 1 && (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="signup-name" className="block text-sm font-medium" style={{ color: '#a0a0cc' }}>
                    Tu nombre de guerrero
                  </label>
                  <p className="text-xs" style={{ color: '#6060aa' }}>
                    Así te llamará NEXUS en tu aventura
                  </p>
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="Ej. Xóchitl, Cuauhtémoc, Alejandro…"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(17,17,40,0.8)',
                      border: `1px solid ${signupForm.formState.errors.name ? '#e85d2f' : '#2a2a5a'}`,
                      color: '#f0f0ff',
                    }}
                    onFocus={(event) => { event.currentTarget.style.borderColor = '#00d4aa'; }}
                    onBlur={(event) => { event.currentTarget.style.borderColor = signupForm.formState.errors.name ? '#e85d2f' : '#2a2a5a'; }}
                    {...signupForm.register('name', {
                      required: 'Tu nombre es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    })}
                  />
                  {signupForm.formState.errors.name && (
                    <p className="text-xs" style={{ color: '#e85d2f' }}>
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-email" className="block text-sm font-medium" style={{ color: '#a0a0cc' }}>
                    Correo electrónico
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="tu@correo.com"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(17,17,40,0.8)',
                      border: `1px solid ${signupForm.formState.errors.email ? '#e85d2f' : '#2a2a5a'}`,
                      color: '#f0f0ff',
                    }}
                    onFocus={(event) => { event.currentTarget.style.borderColor = '#00d4aa'; }}
                    onBlur={(event) => { event.currentTarget.style.borderColor = signupForm.formState.errors.email ? '#e85d2f' : '#2a2a5a'; }}
                    {...signupForm.register('email', {
                      required: 'El correo es obligatorio',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Formato de correo inválido' },
                    })}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-xs" style={{ color: '#e85d2f' }}>
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-password" className="block text-sm font-medium" style={{ color: '#a0a0cc' }}>
                    Contraseña cósmica
                  </label>
                  <p className="text-xs" style={{ color: '#6060aa' }}>
                    Mínimo 8 caracteres, incluye números y letras
                  </p>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(17,17,40,0.8)',
                        border: `1px solid ${signupForm.formState.errors.password ? '#e85d2f' : '#2a2a5a'}`,
                        color: '#f0f0ff',
                      }}
                      onFocus={(event) => { event.currentTarget.style.borderColor = '#00d4aa'; }}
                      onBlur={(event) => { event.currentTarget.style.borderColor = signupForm.formState.errors.password ? '#e85d2f' : '#2a2a5a'; }}
                      {...signupForm.register('password', {
                        required: 'La contraseña es obligatoria',
                        minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                        pattern: { value: /(?=.*[0-9])/, message: 'Debe incluir al menos un número' },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      aria-label="Mostrar u ocultar contraseña"
                    >
                      <span style={{ fontSize: 16 }}>{showPassword ? '🙈' : '👁️'}</span>
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-xs" style={{ color: '#e85d2f' }}>
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-confirm" className="block text-sm font-medium" style={{ color: '#a0a0cc' }}>
                    Confirma tu contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(17,17,40,0.8)',
                        border: `1px solid ${signupForm.formState.errors.confirmPassword ? '#e85d2f' : '#2a2a5a'}`,
                        color: '#f0f0ff',
                      }}
                      onFocus={(event) => { event.currentTarget.style.borderColor = '#00d4aa'; }}
                      onBlur={(event) => { event.currentTarget.style.borderColor = signupForm.formState.errors.confirmPassword ? '#e85d2f' : '#2a2a5a'; }}
                      {...signupForm.register('confirmPassword', {
                        required: 'Confirma tu contraseña',
                        validate: (value) => value === signupForm.getValues('password') || 'Las contraseñas no coinciden',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      aria-label="Mostrar u ocultar confirmación"
                    >
                      <span style={{ fontSize: 16 }}>{showConfirmPassword ? '🙈' : '👁️'}</span>
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-xs" style={{ color: '#e85d2f' }}>
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {signupStep === 2 && <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} />}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-cosmic flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold"
              style={{
                background: isLoading ? 'rgba(0,212,170,0.3)' : 'linear-gradient(135deg, #00d4aa 0%, #006655 100%)',
                color: '#0a0a1a',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  </svg>
                  Forjando tu destino…
                </>
              ) : signupStep === 1 ? (
                'Continuar → Elegir avatar'
              ) : (
                '⚡ ¡Unirme al cosmos!'
              )}
            </button>

            {signupStep === 2 && (
              <button
                type="button"
                onClick={() => setSignupStep(1)}
                className="w-full py-2 text-sm"
                style={{ color: '#6060aa' }}
              >
                ← Volver a datos básicos
              </button>
            )}
          </form>

          <div className="text-center">
            <button type="button" onClick={() => setMode('intro')} className="text-sm" style={{ color: '#6060aa' }}>
              ← Volver
            </button>
            <span className="mx-3" style={{ color: '#2a2a5a' }}>·</span>
            <button type="button" onClick={() => setMode('login')} className="text-sm" style={{ color: '#00d4aa' }}>
              ¿Ya tienes cuenta? Entrar
            </button>
          </div>

          <p className="text-center text-xs" style={{ color: '#3a3a6a' }}>
            Al registrarte aceptas los{' '}
            <span style={{ color: '#6060aa', cursor: 'pointer' }}>Términos de servicio</span>
            {' '}y la{' '}
            <span style={{ color: '#6060aa', cursor: 'pointer' }}>Política de privacidad</span>
          </p>
        </div>
      )}
    </div>
  );
}

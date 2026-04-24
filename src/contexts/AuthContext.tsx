'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  authenticateMockAccount,
  registerMockAccount,
  signOutMockAccount,
} from '@/lib/nexus-auth';
import { readPlayerProfile } from '@/lib/nexus-progress';

interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: { email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ email: string }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { fullName?: string; avatarId?: string; avatarEmoji?: string }
  ) => Promise<{ email: string }>;
  signOut: () => Promise<boolean>;
  getCurrentUser: () => Promise<AuthUser | null>;
  isEmailVerified: () => boolean;
  getUserProfile: () => Promise<ReturnType<typeof readPlayerProfile>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = readPlayerProfile();
    if (profile?.email) {
      setUser({ email: profile.email, name: profile.name });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const profile = authenticateMockAccount(email, password);
    if (!profile?.email) {
      throw new Error('Credenciales inválidas');
    }

    const nextUser = { email: profile.email, name: profile.name };
    setUser(nextUser);

    return { email: nextUser.email };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { fullName?: string; avatarId?: string; avatarEmoji?: string }
  ) => {
    const profile = registerMockAccount({
      email,
      password,
      name: metadata?.fullName || 'Guerrero Cósmico',
      avatar: metadata?.avatarId || 'avatar-sol',
      avatarEmoji: metadata?.avatarEmoji || '⚡',
    });

    if (!profile.email) {
      throw new Error('No fue posible crear la cuenta');
    }

    const nextUser = { email: profile.email, name: profile.name };
    setUser(nextUser);

    return { email: nextUser.email };
  };

  const signOut = async () => {
    setUser(null);
    return signOutMockAccount();
  };

  const value: AuthContextValue = {
    user,
    session: user ? { email: user.email } : null,
    loading,
    signIn,
    signUp,
    signOut,
    getCurrentUser: async () => user,
    isEmailVerified: () => Boolean(user?.email),
    getUserProfile: async () => readPlayerProfile(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

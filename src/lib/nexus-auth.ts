'use client';

import {
  clearLegacyProgress,
  createInitialPlayerProfile,
  createLessonCompletionKey,
  readPlayerProfile,
  savePlayerProfile,
} from '@/lib/nexus-progress';

export const DEMO_EMAIL = 'guerrero@nexus.mx';
export const DEMO_PASSWORD = 'Cosmos2026!';

const AUTH_STORAGE_KEY = 'nexus_auth_account';

export interface MockAccount {
  name: string;
  email: string;
  password: string;
  avatar: string;
  avatarEmoji: string;
  createdAt: string;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

export function readMockAccount() {
  if (!isBrowser()) return null;

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as MockAccount) : null;
  } catch {
    return null;
  }
}

export function saveMockAccount(account: MockAccount) {
  if (!isBrowser()) return account;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
  return account;
}

export function registerMockAccount(input: Omit<MockAccount, 'createdAt'>) {
  clearLegacyProgress();

  const account: MockAccount = {
    ...input,
    createdAt: new Date().toISOString(),
  };

  saveMockAccount(account);

  return savePlayerProfile(
    createInitialPlayerProfile({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      avatarEmoji: account.avatarEmoji,
    })
  );
}

export function authenticateMockAccount(email: string, password: string) {
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const existingProfile = readPlayerProfile();
    if (existingProfile?.email === DEMO_EMAIL) {
      return existingProfile;
    }

    return savePlayerProfile(
      createInitialPlayerProfile({
        name: 'Guerrero Demo',
        email: DEMO_EMAIL,
        avatar: 'avatar-sol',
        avatarEmoji: '⚡',
        xp: 450,
        streak: 4,
        completedLessons: [createLessonCompletionKey('reino-tiempo', 'lesson-historia-001')],
      })
    );
  }

  const account = readMockAccount();
  if (!account || account.email !== email || account.password !== password) {
    return null;
  }

  const existingProfile = readPlayerProfile();
  if (existingProfile?.email === account.email) {
    return existingProfile;
  }

  return savePlayerProfile(
    createInitialPlayerProfile({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      avatarEmoji: account.avatarEmoji,
    })
  );
}

export function signOutMockAccount() {
  return true;
}

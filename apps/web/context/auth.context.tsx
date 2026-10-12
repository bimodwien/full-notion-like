'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import { AuthContextValue, AuthStatus, AuthToken } from '@/model/auth.model';
import { clearTokens, getAccessToken, saveTokens } from '@/util/token.storage';

const AuthContext = createContext<AuthContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify() {
  listeners.forEach((callback) => callback());
}

function getSnapshot(): AuthStatus {
  return getAccessToken() ? 'authenticated' : 'unauthenticated';
}

function getServerSnapshot(): AuthStatus {
  return 'loading';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function signIn(tokens: AuthToken) {
    saveTokens(tokens);
    notify();
  }

  function signOut() {
    clearTokens();
    notify();
  }

  return (
    <AuthContext.Provider value={{ status, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}

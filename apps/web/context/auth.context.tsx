'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import { AuthContextValue, AuthStatus } from '@/model/auth.model';
import { hasSession, notifySession, subscribeSession } from '@/util/session.cookie';

const AuthContext = createContext<AuthContextValue | null>(null);

function getSnapshot(): AuthStatus {
  return hasSession() ? 'authenticated' : 'unauthenticated';
}

function getServerSnapshot(): AuthStatus {
  return 'loading';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const status = useSyncExternalStore(subscribeSession, getSnapshot, getServerSnapshot);

  return (
    <AuthContext.Provider value={{ status, signIn: notifySession, signOut: notifySession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}

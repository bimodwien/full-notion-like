'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
import { AuthContextValue, AuthStatus } from '@/model/auth.model';
import { clearTokens, getAccessToken, saveTokens, subscribeTokens } from '@/util/token.storage';

const AuthContext = createContext<AuthContextValue | null>(null);

function getSnapshot(): AuthStatus {
  return getAccessToken() ? 'authenticated' : 'unauthenticated';
}

function getServerSnapshot(): AuthStatus {
  return 'loading';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const status = useSyncExternalStore(subscribeTokens, getSnapshot, getServerSnapshot);

  return (
    <AuthContext.Provider value={{ status, signIn: saveTokens, signOut: clearTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}

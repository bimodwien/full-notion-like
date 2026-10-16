import { AuthToken } from '@/model/auth.model';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

// Writes come from the auth context and from the axios refresh, so both must reach the UI.
const listeners = new Set<() => void>();

export function subscribeTokens(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  listeners.forEach((callback) => callback());
}

export function saveTokens({ accessToken, refreshToken }: AuthToken) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  notify();
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  notify();
}

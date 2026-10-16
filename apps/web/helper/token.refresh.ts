import { isAxiosError } from 'axios';
import { refreshTokens } from './auth.api';
import { clearTokens, getRefreshToken, saveTokens } from '@/util/token.storage';

let pending: Promise<string | null> | null = null;

async function runRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const tokens = await refreshTokens(refreshToken);
    saveTokens(tokens);
    return tokens.accessToken;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) clearTokens();
    return null;
  }
}

export function refreshAccessToken() {
  pending ??= runRefresh().finally(() => {
    pending = null;
  });
  return pending;
}

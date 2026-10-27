import { isAxiosError } from 'axios';
import { refreshSession } from './auth.api';
import { hasSession, notifySession } from '@/util/session.cookie';

let pending: Promise<boolean> | null = null;

async function runRefresh() {
  if (!hasSession()) return false;
  try {
    await refreshSession();
    return true;
  } catch (error) {
    // The API already cleared the cookies; the UI only needs to hear about it.
    if (isAxiosError(error) && error.response?.status === 401) notifySession();
    return false;
  }
}

export function refreshAccessToken() {
  pending ??= runRefresh().finally(() => {
    pending = null;
  });
  return pending;
}

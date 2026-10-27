// The tokens sit in httpOnly cookies; this readable one only says whether they exist.
const SIGNED_IN_COOKIE = 'signed_in';

// The API sets and clears the cookie, so whoever made that request tells the UI.
const listeners = new Set<() => void>();

export function subscribeSession(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function notifySession() {
  listeners.forEach((callback) => callback());
}

export function hasSession() {
  return document.cookie.split('; ').some((cookie) => cookie.startsWith(`${SIGNED_IN_COOKIE}=`));
}

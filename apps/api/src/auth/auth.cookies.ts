import type { CookieOptions, Request, Response } from 'express';
import { REFRESH_TTL_MS } from './refresh.token.service';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
export const SIGNED_IN_COOKIE = 'signed_in';

// Cookies ignore the port, so in development the web app on :3000 receives them too.
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  // Unset in development; in production, the parent domain the web app and API share.
  domain: process.env.COOKIE_DOMAIN,
};

// Only /auth/refresh and /auth/logout ever need the refresh token.
const REFRESH_OPTIONS: CookieOptions = {
  ...COOKIE_OPTIONS,
  path: '/auth',
  maxAge: REFRESH_TTL_MS,
};

// Not a secret: lets the web app's JavaScript and proxy.ts tell signed-in visitors apart.
const SIGNED_IN_OPTIONS: CookieOptions = {
  ...COOKIE_OPTIONS,
  httpOnly: false,
  maxAge: REFRESH_TTL_MS,
};

// cookie-parser types every cookie as any; anything but a string counts as missing.
export function readCookie(req: Request, name: string): string | undefined {
  const value: unknown = req.cookies?.[name];
  return typeof value === 'string' ? value : undefined;
}

export function setAuthCookies(
  res: Response,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
) {
  // No maxAge: the JWT expires on its own, and the 401 that follows triggers a refresh.
  res.cookie(ACCESS_COOKIE, accessToken, COOKIE_OPTIONS);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_OPTIONS);
  res.cookie(SIGNED_IN_COOKIE, '1', SIGNED_IN_OPTIONS);
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE, COOKIE_OPTIONS);
  res.clearCookie(REFRESH_COOKIE, REFRESH_OPTIONS);
  res.clearCookie(SIGNED_IN_COOKIE, SIGNED_IN_OPTIONS);
}

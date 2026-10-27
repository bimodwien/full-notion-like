import { NextResponse, type NextRequest } from 'next/server';
import { SIGNED_IN_COOKIE } from '@/util/session.cookie';

const GUEST_ONLY = ['/signin', '/register'];

// Only checks that the session cookie exists: the API still verifies every request,
// and a stale cookie ends in a failed refresh that clears it.
export function proxy(request: NextRequest) {
  const signedIn = request.cookies.has(SIGNED_IN_COOKIE);
  const guestOnly = GUEST_ONLY.includes(request.nextUrl.pathname);
  if (guestOnly && signedIn) return NextResponse.redirect(new URL('/', request.url));
  if (!guestOnly && !signedIn) return NextResponse.redirect(new URL('/signin', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/workspaces/:path*', '/signin', '/register'],
};

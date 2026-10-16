'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';

export function SignedInOnly({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/signin');
  }, [status, router]);

  if (status === 'loading') return null;

  if (status === 'unauthenticated') {
    return (
      <p role="status" className="text-base text-ink-muted">
        You&apos;re signed out. Opening the sign-in page…
      </p>
    );
  }

  return children;
}

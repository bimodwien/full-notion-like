'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth.context';

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  if (status === 'authenticated') {
    return (
      <p role="status" className="text-center text-base text-ink-muted">
        You&apos;re signed in. Opening the home page…
      </p>
    );
  }

  return children;
}

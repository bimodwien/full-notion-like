'use client';

import Link from 'next/link';
import { buttonStyles } from '@/component/ui/button.styles';
import { useAuth } from '@/context/auth.context';

function HeroAction() {
  const { status } = useAuth();

  if (status === 'loading') return null;

  if (status === 'authenticated') {
    return (
      <p className="max-w-136 text-base text-on-primary">
        You&apos;re signed in. Workspaces have no screen here yet, so there is nothing to open.
      </p>
    );
  }

  return (
    <Link
      href="/register"
      className={buttonStyles('secondary', 'focus-visible:outline-on-primary')}
    >
      Create an account
    </Link>
  );
}

export function HeroActions() {
  // The fixed minimum height keeps the band from jumping once the status is known.
  return (
    <div className="mt-8 flex min-h-12 items-center">
      <HeroAction />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { buttonStyles } from '@/component/ui/button.styles';
import { useAuth } from '@/context/auth.context';

function HeroAction() {
  const { status } = useAuth();

  if (status === 'loading') return null;

  const signedIn = status === 'authenticated';

  return (
    <Link
      href={signedIn ? '/workspaces' : '/register'}
      className={buttonStyles('secondary', 'focus-visible:outline-on-primary')}
    >
      {signedIn ? 'Open your workspace' : 'Create an account'}
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

'use client';

import Link from 'next/link';
import { SignOutButton } from '@/component/auth/sign.out.button';
import { buttonStyles } from '@/component/ui/button.styles';
import { useAuth } from '@/context/auth.context';

// Sign in and Sign out share this so the two states line up exactly.
const TEXT_ACTION =
  'inline-flex min-h-11 cursor-pointer items-center px-3 text-body-sm font-medium text-ink hover:underline';

export function NavActions() {
  const { status } = useAuth();

  if (status === 'loading') return <div className="min-h-11" />;

  const signedIn = status === 'authenticated';

  return (
    <div className="flex items-center gap-2">
      {signedIn ? (
        <SignOutButton className={TEXT_ACTION} />
      ) : (
        <Link href="/signin" className={TEXT_ACTION}>
          Sign in
        </Link>
      )}
      {/* Phones get this action from the hero button right below the nav. */}
      <div className="hidden sm:block">
        <Link href={signedIn ? '/workspaces' : '/register'} className={buttonStyles('primary')}>
          {signedIn ? 'Open workspace' : 'Create account'}
        </Link>
      </div>
    </div>
  );
}

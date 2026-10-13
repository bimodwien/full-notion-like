'use client';

import Link from 'next/link';
import { SignOutButton } from '@/component/auth/sign.out.button';
import { buttonStyles } from '@/component/ui/button.styles';
import { useAuth } from '@/context/auth.context';

export function NavActions() {
  const { status } = useAuth();

  if (status === 'loading') return <div className="min-h-11" />;
  if (status === 'authenticated') return <SignOutButton />;

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/signin"
        className="inline-flex min-h-11 items-center px-3 text-body-sm font-medium text-ink hover:underline"
      >
        Sign in
      </Link>
      {/* Phones get this action from the hero button right below the nav. */}
      <div className="hidden sm:block">
        <Link href="/register" className={buttonStyles('utility')}>
          Create account
        </Link>
      </div>
    </div>
  );
}

'use client';

import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { useAuth } from '@/context/auth.context';
import { logout } from '@/helper/auth.api';
import { getRefreshToken } from '@/util/token.storage';

export function SignOutButton({ className = buttonStyles('utility') }: { className?: string }) {
  const { signOut } = useAuth();

  function handleClick() {
    const refreshToken = getRefreshToken();
    // Not awaited: this browser signs out even when the server can't be reached.
    if (refreshToken) logout(refreshToken).catch(() => undefined);
    signOut();
    toast('Signed out.');
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      Sign out
    </button>
  );
}

'use client';

import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { useAuth } from '@/context/auth.context';
import { logout } from '@/helper/auth.api';

export function SignOutButton({ className = buttonStyles('utility') }: { className?: string }) {
  const { signOut } = useAuth();

  // Only the API can clear httpOnly cookies, so signing out waits for it.
  async function handleClick() {
    try {
      await logout();
      signOut();
      toast('Signed out.');
    } catch {
      toast("Couldn't sign out. Check your connection and try again.");
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      Sign out
    </button>
  );
}

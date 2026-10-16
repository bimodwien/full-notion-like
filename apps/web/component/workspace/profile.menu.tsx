'use client';

import Link from 'next/link';
import { SignOutButton } from '@/component/auth/sign.out.button';
import { MENU_PANEL, MENU_ROW } from '@/component/ui/menu.styles';

type ProfileMenuProps = {
  id: string;
  failed: boolean;
  onRetry: () => void;
};

// Opens upward because the profile button sits at the bottom of the sidebar.
export function ProfileMenu({ id, failed, onRetry }: ProfileMenuProps) {
  return (
    <div id={id} className={`${MENU_PANEL} bottom-full mb-1`}>
      {failed && (
        <button type="button" onClick={onRetry} className={MENU_ROW}>
          Load profile again
        </button>
      )}
      <Link href="/" className={MENU_ROW}>
        Home page
      </Link>
      <div className="my-1 border-t border-hairline" />
      <SignOutButton className={MENU_ROW} />
    </div>
  );
}

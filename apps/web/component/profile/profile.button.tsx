'use client';

import { useId, useRef, useState } from 'react';
import { Initial } from '@/component/ui/initial';
import { MENU_TRIGGER } from '@/component/ui/menu.styles';
import { useDismiss } from '@/component/ui/use.dismiss';
import { ProfileMenu } from '@/component/profile/profile.menu';
import { ProfileState, useProfile } from '@/component/profile/use.profile';

function profileText(state: ProfileState) {
  if (state.kind === 'ready') return { name: state.profile.name, email: state.profile.email };
  if (state.kind === 'error') return { name: 'Your account', email: "Profile didn't load" };
  return { name: 'Loading…', email: '' };
}

export function ProfileButton() {
  const { state, retry } = useProfile();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useDismiss(open, setOpen, { root, trigger });
  const { name, email } = profileText(state);

  return (
    <div ref={root} className="relative mt-2">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        className={`${MENU_TRIGGER} py-1.5`}
      >
        {state.kind === 'ready' && <Initial name={name} />}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-sm font-medium text-ink">{name}</span>
          {email && <span className="block truncate text-xs text-ink-muted">{email}</span>}
        </span>
      </button>
      {open && (
        <ProfileMenu
          id={menuId}
          failed={state.kind === 'error'}
          onRetry={() => {
            setOpen(false);
            retry();
          }}
        />
      )}
    </div>
  );
}

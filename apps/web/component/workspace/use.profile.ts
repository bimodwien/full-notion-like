'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/helper/auth.api';
import { UserProfile } from '@/model/auth.model';

export type ProfileState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; profile: UserProfile };

export function useProfile() {
  const [state, setState] = useState<ProfileState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((profile) => {
        if (active) setState({ kind: 'ready', profile });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((count) => count + 1);
  }

  return { state, retry };
}

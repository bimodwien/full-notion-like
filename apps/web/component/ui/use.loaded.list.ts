'use client';

import { useEffect, useState } from 'react';
export type LoadedList<T> = { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; items: T[] };

export function useLoadedList<T>(load: () => Promise<T[]>) {
  const [state, setState] = useState<LoadedList<T>>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    load()
      .then((items) => {
        if (active) setState({ kind: 'ready', items });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [load, attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((count) => count + 1);
  }

  function updateList(change: (items: T[]) => T[]) {
    setState((current) =>
      current.kind === 'ready' ? { kind: 'ready', items: change(current.items) } : current,
    );
  }

  return { state, retry, updateList };
}

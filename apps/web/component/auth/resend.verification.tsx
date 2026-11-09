'use client';

import { useState } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { resendVerification } from '@/helper/auth.api';
import { requestErrorMessage } from '@/helper/request.error';

type State = 'idle' | 'sending' | 'sent' | 'failed';

export function ResendVerification({ email }: { email: string }) {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  async function resend() {
    setState('sending');
    try {
      await resendVerification(email);
      setState('sent');
    } catch (err) {
      setError(requestErrorMessage(err));
      setState('failed');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={resend}
        disabled={state === 'sending'}
        className={buttonStyles('utility', 'w-full')}
      >
        {state === 'sending' ? 'Sending…' : 'Send a new link'}
      </button>
      <p role="status" className="text-center text-sm text-ink-muted">
        {state === 'sent' && 'New link sent. Only the newest link works.'}
        {state === 'failed' && error}
      </p>
    </div>
  );
}

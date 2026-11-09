'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { buttonStyles } from '@/component/ui/button.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { verifyEmail } from '@/helper/auth.api';
import { requestErrorMessage } from '@/helper/request.error';

type Result =
  { status: 'verifying' } | { status: 'verified' } | { status: 'failed'; message: string };

const HEADING = 'mb-3 text-center text-h3 font-semibold text-ink';

export function VerifyingNotice() {
  return (
    <p role="status" className="text-center text-body-sm text-ink-muted">
      Verifying your email…
    </p>
  );
}

function useVerification(token: string | null) {
  const [result, setResult] = useState<Result>({ status: 'verifying' });
  // A token works once, and Strict Mode runs effects twice in dev.
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const request = token ? verifyEmail(token) : Promise.reject(new Error('missing token'));
    request.then(
      () => setResult({ status: 'verified' }),
      (error: unknown) =>
        setResult({
          status: 'failed',
          message: token ? requestErrorMessage(error) : 'This link is missing its token.',
        }),
    );
  }, [token]);

  return result;
}

export function VerifyEmail() {
  const result = useVerification(useSearchParams().get('token'));
  if (result.status === 'verifying') return <VerifyingNotice />;

  return (
    <section className="flex flex-col gap-5">
      <h1 className={HEADING}>
        {result.status === 'verified' ? 'Email verified' : "We couldn't verify your email"}
      </h1>
      {result.status === 'verified' ? (
        <p className="text-center text-body-sm text-ink-secondary">
          Your account is ready. Sign in to open your workspace.
        </p>
      ) : (
        <>
          <FormAlert message={result.message} />
          <p className="text-center text-body-sm text-ink-secondary">
            Sign in with your email and password to get a new link.
          </p>
        </>
      )}
      <Link href="/signin" className={buttonStyles('primary', 'w-full')}>
        Sign in
      </Link>
    </section>
  );
}

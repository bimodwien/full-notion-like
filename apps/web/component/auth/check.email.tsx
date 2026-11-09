'use client';

import { useEffect, useRef } from 'react';
import { AuthSwitch } from '@/component/auth/auth.switch';
import { ResendVerification } from '@/component/auth/resend.verification';

export function CheckEmail({ email }: { email: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  // The form that had focus is gone, so screen readers land here instead of on nothing.
  useEffect(() => heading.current?.focus(), []);

  return (
    <section aria-labelledby="check-email" className="flex flex-col gap-5">
      <h1
        id="check-email"
        ref={heading}
        tabIndex={-1}
        className="text-center text-h3 font-semibold text-ink outline-none"
      >
        Check your email
      </h1>
      <p className="text-center text-body-sm text-ink-secondary">
        We sent a link to <strong className="font-medium text-ink">{email}</strong>. Open it to
        finish creating your account. The link expires in 10 minutes.
      </p>
      <ResendVerification email={email} />
      <AuthSwitch question="Verified already?" href="/signin" label="Sign in" />
    </section>
  );
}

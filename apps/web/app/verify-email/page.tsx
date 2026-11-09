import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmail, VerifyingNotice } from '@/component/auth/verify.email';

export const metadata: Metadata = {
  title: 'Verify your email',
};

// The token lives in the URL, which cacheComponents only allows inside Suspense.
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyingNotice />}>
      <VerifyEmail />
    </Suspense>
  );
}

import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export function Wordmark() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center text-lg font-bold tracking-tight text-ink"
    >
      {SITE_NAME}
    </Link>
  );
}

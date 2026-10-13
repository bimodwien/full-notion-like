import { SITE_TAGLINE } from '@/lib/site';

export function AuthHeading({ action }: { action: string }) {
  return (
    <h1 className="mb-3 text-center text-h3 font-semibold text-balance">
      <span className="block text-ink">{SITE_TAGLINE}</span>
      <span className="block text-ink-muted">{action}</span>
    </h1>
  );
}

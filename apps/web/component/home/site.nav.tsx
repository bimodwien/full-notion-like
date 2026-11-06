import { NavActions } from '@/component/home/nav.actions';
import { NavShell } from '@/component/home/nav.shell';
import { Wordmark } from '@/component/ui/wordmark';

export function SiteNav() {
  return (
    <NavShell>
      <nav
        aria-label="Main"
        className="mx-auto max-w-360 flex items-center justify-between gap-4 px-4 py-4 sm:px-8"
      >
        <Wordmark />
        <NavActions />
      </nav>
    </NavShell>
  );
}

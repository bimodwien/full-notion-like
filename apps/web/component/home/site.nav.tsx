import { NavActions } from '@/component/home/nav.actions';
import { Wordmark } from '@/component/ui/wordmark';

export function SiteNav() {
  return (
    <header className="border-b border-hairline bg-canvas">
      <nav
        aria-label="Main"
        className="mx-auto flex items-center justify-between gap-4 px-4 py-2 sm:px-8"
      >
        <Wordmark />
        <NavActions />
      </nav>
    </header>
  );
}

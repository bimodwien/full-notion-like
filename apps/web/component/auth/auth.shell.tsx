import { GuestOnly } from '@/component/auth/guest.only';
import { Wordmark } from '@/component/ui/wordmark';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    // Plain white with no card, unlike the soft canvas the other pages sit on.
    <div className="flex flex-1 flex-col items-center justify-center bg-canvas px-4 pt-12 pb-24">
      <div className="w-full max-w-90">
        <header className="mb-4 flex justify-center">
          <Wordmark />
        </header>
        <main>
          <GuestOnly>{children}</GuestOnly>
        </main>
      </div>
    </div>
  );
}

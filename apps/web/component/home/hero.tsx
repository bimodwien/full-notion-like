import { HeroActions } from '@/component/home/hero.actions';

export function Hero() {
  return (
    <section className="flex min-h-[calc(100svh-61px)] items-center bg-canvas text-center text-ink">
      <div className="mx-auto w-full max-w-360 px-4 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-280">
          <h1 className="text-pretty text-display">Team docs and tasks in one workspace.</h1>
          <p className="mx-auto mt-6 max-w-180 text-pretty text-lg text-ink-muted">
            A workspace for nested pages and a task board. Create an account, start a workspace, and
            invite people as editors or viewers.
          </p>
          <HeroActions />
        </div>
      </div>
    </section>
  );
}

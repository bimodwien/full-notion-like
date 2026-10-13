import { HeroActions } from '@/component/home/hero.actions';

export function Hero() {
  return (
    <section className="bg-secondary text-on-primary">
      <div className="mx-auto max-w-360 px-4 py-14 sm:px-8 sm:py-24">
        <h1 className="max-w-[16ch] text-display">Team docs and tasks in one workspace.</h1>
        <p className="mt-6 max-w-136 text-lg text-on-secondary-muted">
          This is an early build. You can create an account today, and the list below shows what the
          rest still needs.
        </p>
        <HeroActions />
      </div>
    </section>
  );
}

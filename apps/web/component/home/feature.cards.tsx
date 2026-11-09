import { FEATURES, Feature } from '@/component/home/feature.items';

function FeatureCard({ title, detail, icon }: Feature) {
  return (
    <li
      className="rounded-lg border border-hairline bg-surface p-5 transition-[box-shadow,transform] hover:scale-[1.02]
 duration-200 hover:shadow-[0_2px_6px_rgb(0_0_0/0.06),0_12px_32px_rgb(0_0_0/0.12)] motion-reduce:transition-none sm:p-6 cursor-pointer"
    >
      {icon}
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-body-sm leading-6 text-ink-muted">{detail}</p>
    </li>
  );
}

export function FeatureCards() {
  return (
    <section aria-labelledby="features" className="mx-auto max-w-360 px-4 py-12 sm:px-8 sm:py-20">
      <h2 id="features" className="text-h1 text-ink">
        What it can do
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </ul>
    </section>
  );
}

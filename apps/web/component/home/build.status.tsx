import { BUILD_ITEMS, BuildItem, BuildState, STATE_LABEL } from '@/component/home/build.items';

const DOT: Record<BuildState, string> = {
  done: 'bg-accent-teal',
  planned: 'border-2 border-field',
};

function BuildRow({ name, detail, state }: BuildItem) {
  return (
    <li className="grid gap-x-6 gap-y-1 px-4 py-4 sm:grid-cols-[12rem_1fr_8rem] sm:px-6">
      <h3 className="text-base font-semibold text-ink">{name}</h3>
      <p className="text-body-sm text-ink-muted sm:text-base">{detail}</p>
      <p className="flex items-center gap-2 text-sm text-ink-secondary sm:h-6">
        <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${DOT[state]}`} />
        {STATE_LABEL[state]}
      </p>
    </li>
  );
}

export function BuildStatus() {
  return (
    <section
      aria-labelledby="build-status"
      className="mx-auto max-w-360 px-4 py-12 sm:px-8 sm:py-20"
    >
      <h2 id="build-status" className="text-h1 text-ink">
        Where the build stands
      </h2>
      <ul className="mt-8 divide-y divide-hairline rounded-lg border border-hairline bg-surface">
        {BUILD_ITEMS.map((item) => (
          <BuildRow key={item.name} {...item} />
        ))}
      </ul>
    </section>
  );
}

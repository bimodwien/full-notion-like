// No profile photos yet, so the first letter of the name stands in.
export function Initial({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hairline text-body-sm font-semibold text-ink"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export function FormAlert({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-xs border border-error bg-canvas-soft px-3 py-2 text-sm text-error"
    >
      {message}
    </p>
  );
}

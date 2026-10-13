import { useId } from 'react';

type Props = {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  autoComplete: string;
  placeholder?: string;
  hint?: string;
  error?: string;
};

const INPUT =
  'min-h-11 w-full rounded-xs border border-field bg-surface px-3 text-base text-ink placeholder:text-ink-faint focus-visible:shadow-soft aria-invalid:border-2 aria-invalid:border-error';

export function TextField(props: Props) {
  const { label, name, type = 'text', autoComplete, placeholder, hint, error } = props;
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? hint;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? noteId : undefined}
        className={INPUT}
      />
      {note && (
        <p id={noteId} className={error ? 'text-sm text-error' : 'text-xs text-ink-muted'}>
          {note}
        </p>
      )}
    </div>
  );
}

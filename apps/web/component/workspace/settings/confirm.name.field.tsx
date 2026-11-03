'use client';

import { useId } from 'react';
import { INPUT } from '@/component/ui/text.field';

type Props = {
  name: string;
  value: string;
  error: string;
  onChange: (value: string) => void;
};

export function ConfirmNameField({ name, value, error, onChange }: Props) {
  const inputId = useId();
  return (
    <>
      <label htmlFor={inputId} className="mt-4 block text-xs font-medium text-ink-muted">
        Type <span className="font-semibold wrap-break-word text-ink">{name}</span> to confirm
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`${INPUT} mt-1`}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </>
  );
}

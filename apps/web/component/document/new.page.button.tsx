'use client';

import { MENU_TRIGGER } from '@/component/ui/menu.styles';
import { useCreatePage } from '@/component/document/use.create.page';

export function NewPageButton() {
  const { busy, failed, create } = useCreatePage();

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => create(null)}
        disabled={busy}
        className={`${MENU_TRIGGER} text-body-sm text-ink-secondary disabled:cursor-wait`}
      >
        <span aria-hidden="true">+</span>
        {busy ? 'Creating page…' : 'New page'}
      </button>
      {failed && (
        <p role="alert" className="px-2 pt-1 text-body-sm text-ink">
          Couldn&apos;t create a page. Try again.
        </p>
      )}
    </div>
  );
}

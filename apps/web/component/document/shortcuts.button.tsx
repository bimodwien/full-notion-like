'use client';

import { useRef, useState } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL_WIDE } from '@/component/ui/dialog.styles';
import { useShowModal } from '@/component/ui/use.show.modal';
import { BLOCK_SHORTCUTS, FORMAT_SHORTCUTS, Shortcut } from '@/component/document/editor.shortcuts';

function keyLabel(key: string, isMac: boolean) {
  if (key === 'Mod') return isMac ? '⌘' : 'Ctrl';
  if (key === 'Shift') return isMac ? '⇧' : 'Shift';
  return key;
}

function ShortcutList({
  title,
  items,
  isMac,
}: {
  title: string;
  items: Shortcut[];
  isMac: boolean;
}) {
  return (
    <section>
      <h3 className="text-base font-semibold">{title}</h3>
      <dl className="mt-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 py-1.5">
            <dt className="text-base">{item.label}</dt>
            <dd className="flex gap-1">
              {item.keys.map((key) => (
                <kbd
                  key={key}
                  className="rounded border border-hairline bg-canvas-soft px-1.5 font-mono text-body-sm"
                >
                  {keyLabel(key, isMac)}
                </kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useShowModal(ref);
  // Safe to read here: the dialog only mounts after a click, never on the server.
  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

  return (
    <dialog
      ref={ref}
      aria-labelledby="shortcuts-heading"
      onClose={onClose}
      className={DIALOG_PANEL_WIDE}
    >
      <h2 id="shortcuts-heading" className="text-h3">
        Writing shortcuts
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <ShortcutList title="Format text" items={FORMAT_SHORTCUTS} isMac={isMac} />
        <ShortcutList title="Start a line with" items={BLOCK_SHORTCUTS} isMac={isMac} />
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className={buttonStyles('utility')}
        >
          Close
        </button>
      </div>
    </dialog>
  );
}

export function ShortcutsButton() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className={buttonStyles('utility')}
      >
        Shortcuts
      </button>
      {open && (
        <ShortcutsDialog
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      )}
    </>
  );
}

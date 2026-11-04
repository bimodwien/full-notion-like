const DIALOG_BASE =
  'm-auto rounded-lg border border-hairline bg-surface p-4 text-ink shadow-soft backdrop:bg-black/40';

export const DIALOG_PANEL = `${DIALOG_BASE} w-[min(24rem,calc(100%-2rem))]`;

// For dialogs with two columns of fields.
export const DIALOG_PANEL_WIDE = `${DIALOG_BASE} w-[min(32rem,calc(100%-2rem))]`;

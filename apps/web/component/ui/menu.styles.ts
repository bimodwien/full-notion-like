export const MENU_SURFACE = 'z-10 rounded-md border border-hairline bg-surface p-1 shadow-soft';

export const MENU_PANEL = `absolute inset-x-0 ${MENU_SURFACE}`;

// Rows are 36px with a mouse and 44px on touch screens.
const ROW_HEIGHT = 'min-h-9 pointer-coarse:min-h-11';

export const MENU_ROW = `flex ${ROW_HEIGHT} w-full cursor-pointer items-center gap-2 rounded-sm px-2 text-left text-sm text-ink transition-colors hover:bg-canvas-soft`;

export const MENU_TRIGGER = `flex ${ROW_HEIGHT} w-full cursor-pointer items-center gap-2 rounded-sm px-2 text-left transition-colors hover:bg-black/5`;

export type Shortcut = { label: string; keys: string[] };

// "Mod" is Ctrl, or ⌘ on a Mac, the same convention Tiptap's keymaps use.
export const FORMAT_SHORTCUTS: Shortcut[] = [
  { label: 'Bold', keys: ['Mod', 'B'] },
  { label: 'Italic', keys: ['Mod', 'I'] },
  { label: 'Underline', keys: ['Mod', 'U'] },
  { label: 'Strikethrough', keys: ['Mod', 'Shift', 'S'] },
  { label: 'Inline code', keys: ['Mod', 'E'] },
  { label: 'Undo', keys: ['Mod', 'Z'] },
  { label: 'Redo', keys: ['Mod', 'Y'] },
];

// Typed at the start of an empty line.
export const BLOCK_SHORTCUTS: Shortcut[] = [
  { label: 'Heading', keys: ['#', 'Space'] },
  { label: 'Subheading', keys: ['##', 'Space'] },
  { label: 'Small heading', keys: ['###', 'Space'] },
  { label: 'Bulleted list', keys: ['-', 'Space'] },
  { label: 'Numbered list', keys: ['1.', 'Space'] },
  { label: 'Quote', keys: ['>', 'Space'] },
  { label: 'Code block', keys: ['```', 'Space'] },
  { label: 'Divider', keys: ['---'] },
];

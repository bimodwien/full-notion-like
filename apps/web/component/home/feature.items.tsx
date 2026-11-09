import { Icon } from '@/component/ui/icons';
import { KBD } from '@/component/ui/kbd.styles';

export type Feature = {
  title: string;
  detail: React.ReactNode;
  icon: React.ReactNode;
};

// The 16px set drawn at 24px; stroke-width 1 keeps the line as thin as the icons inside the app.
const ICON_SIZE = 'size-10 [stroke-width:1]';

// One colour per part of the app: documents, tasks, and people.
const DOCS = `${ICON_SIZE} text-primary`;
const TASKS = `${ICON_SIZE} text-accent-orange`;
const PEOPLE = `${ICON_SIZE} text-accent-teal`;

// Only features that work in the app today; the home page is tried by people deciding on it.
export const FEATURES: Feature[] = [
  {
    title: 'Pages inside pages',
    detail: 'Nest a page inside another and move it anywhere in the tree',
    icon: (
      <Icon className={DOCS}>
        <path d="M4 2.5h5l3 3v8H4z" />
        <path d="M9 2.5v3h3M6 8.5h4M6 11h3" />
      </Icon>
    ),
  },
  {
    title: 'Write together',
    detail: 'Everyone on the same page sees each edit as it is typed',
    icon: (
      <Icon className={DOCS}>
        <path d="M10.5 3l2.5 2.5-7 7H3.5V10z" />
        <path d="M9 4.5l2.5 2.5" />
      </Icon>
    ),
  },
  {
    title: 'A board for tasks',
    detail: 'Drag tasks between To do, In progress, In review and Done',
    icon: (
      <Icon className={TASKS}>
        <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
        <path d="M6.2 3v10M9.8 3v10" />
      </Icon>
    ),
  },
  {
    title: 'Editors and viewers',
    detail: 'Workspace owners invite people and decide who can edit',
    icon: (
      <Icon className={PEOPLE}>
        <circle cx="8" cy="5.5" r="2.5" />
        <path d="M3.5 13c.6-2.3 2.4-3.5 4.5-3.5s3.9 1.2 4.5 3.5" />
      </Icon>
    ),
  },
  {
    title: 'Markdown shortcuts',
    detail: (
      <>
        Type <kbd className={KBD}>#</kbd> for a heading, <kbd className={KBD}>-</kbd> for a list or{' '}
        <kbd className={KBD}>```</kbd> for code
      </>
    ),
    icon: (
      <Icon className={DOCS}>
        <rect x="1.5" y="4" width="13" height="8" rx="1.5" />
        <path d="M4.5 7h.01M7 7h.01M9 7h.01M11.5 7h.01M5.5 9.5h5" />
      </Icon>
    ),
  },
  {
    title: 'Tasks on their page',
    detail: 'Link a task to a page and it shows up under that document',
    icon: (
      <Icon className={TASKS}>
        <path d="M4 2.5h5l3 3v8H4z" />
        <path d="M6 9.5l1.3 1.3L10 8" />
      </Icon>
    ),
  },
];

export type BuildState = 'done' | 'planned';

export type BuildItem = {
  name: string;
  detail: string;
  state: BuildState;
};

export const STATE_LABEL: Record<BuildState, string> = {
  done: 'Works today',
  planned: 'Not started',
};

export const BUILD_ITEMS: BuildItem[] = [
  {
    name: 'Accounts',
    detail: 'Create an account and sign in from this site.',
    state: 'done',
  },
  {
    name: 'Workspaces and roles',
    detail: 'An owner adds members as editors or viewers.',
    state: 'done',
  },
  {
    name: 'Nested pages',
    detail: 'A page can hold other pages. Deleting one removes everything under it.',
    state: 'done',
  },
  {
    name: 'Tasks',
    detail: 'A task moves one step at a time: To do, In progress, In review, Done.',
    state: 'done',
  },
  {
    name: 'Live editing',
    detail: 'Everyone in a page sees changes as they are typed.',
    state: 'done',
  },
  {
    name: 'Shared cursors',
    detail: 'You cannot yet see where other people are typing.',
    state: 'planned',
  },
  {
    name: 'Email verification',
    detail: 'New accounts are not checked by email yet.',
    state: 'planned',
  },
  {
    name: 'Docker and deploy',
    detail: 'A container setup and a public address for the site.',
    state: 'planned',
  },
];

export type BuildState = 'web' | 'api' | 'planned';

export type BuildItem = {
  name: string;
  detail: string;
  state: BuildState;
};

export const STATE_LABEL: Record<BuildState, string> = {
  web: 'On this site',
  api: 'API only',
  planned: 'Not started',
};

export const BUILD_ITEMS: BuildItem[] = [
  {
    name: 'Accounts',
    detail: 'Create an account and sign in from this site.',
    state: 'web',
  },
  {
    name: 'Workspaces and roles',
    detail: 'An owner adds members as editors or viewers.',
    state: 'api',
  },
  {
    name: 'Nested pages',
    detail: 'A page can hold other pages. Deleting one removes everything under it.',
    state: 'api',
  },
  {
    name: 'Tasks',
    detail: 'A task moves one step at a time: To do, In progress, In review, Done.',
    state: 'api',
  },
  {
    name: 'Live editing',
    detail: 'Several people typing in the same page at once.',
    state: 'planned',
  },
];

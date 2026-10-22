'use client';

import { buttonStyles } from '@/component/ui/button.styles';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { NewTaskButton } from '@/component/task/new.task.button';
import { TaskBoard } from '@/component/task/task.board';
import { TasksProvider, useWorkspaceTasks } from '@/component/task/tasks.context';

function TasksHeader() {
  const { canEdit } = useWorkspaceDocuments();
  const { state } = useWorkspaceTasks();
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-h2 text-ink">Tasks</h1>
      {canEdit && state.kind === 'ready' && <NewTaskButton />}
    </div>
  );
}

function TasksBody() {
  const { state, retry } = useWorkspaceTasks();

  if (state.kind === 'loading') {
    return (
      <p role="status" className="text-base text-ink-muted">
        Loading tasks…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <div role="alert">
        <p className="text-base font-semibold text-ink">Couldn&apos;t load tasks.</p>
        <button type="button" onClick={retry} className={buttonStyles('utility', 'mt-4')}>
          Try again
        </button>
      </div>
    );
  }
  return <TaskBoard tasks={state.tasks} />;
}

export function TasksView() {
  const { workspaceId } = useWorkspaceDocuments();
  return (
    <TasksProvider workspaceId={workspaceId}>
      <div className="mx-auto max-w-360">
        <TasksHeader />
        <TasksBody />
      </div>
    </TasksProvider>
  );
}

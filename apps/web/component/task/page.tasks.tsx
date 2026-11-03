'use client';

import { buttonStyles } from '@/component/ui/button.styles';
import { useWorkspaceAccess } from '@/component/workspace/workspace.access.context';
import { TaskCard } from '@/component/task/task.card';
import { TasksProvider, useWorkspaceTasks } from '@/component/task/tasks.context';
import { NewTaskButton } from '@/component/task/new.task.button';

function PageTasksBody() {
  const { state, retry } = useWorkspaceTasks();

  if (state.kind === 'loading') {
    return (
      <p role="status" className="text-body-sm text-ink-muted">
        Loading tasks…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <div role="alert">
        <p className="text-body-sm text-ink">Couldn&apos;t load this page&apos;s tasks.</p>
        <button type="button" onClick={retry} className={buttonStyles('utility', 'mt-3')}>
          Try again
        </button>
      </div>
    );
  }
  if (state.items.length === 0) {
    return <p className="text-body-sm text-ink-muted">No tasks are linked to this page yet.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {state.items.map((task) => (
        <TaskCard key={task.id} task={task} showStatus />
      ))}
    </ul>
  );
}

function PageTasksAction() {
  const { canEdit } = useWorkspaceAccess();
  const { state } = useWorkspaceTasks();
  if (!canEdit || state.kind !== 'ready') return null;
  return <NewTaskButton />;
}

export function PageTasks({ documentId }: { documentId: string }) {
  const { workspaceId } = useWorkspaceAccess();
  return (
    <TasksProvider workspaceId={workspaceId} documentId={documentId}>
      <section aria-labelledby="page-tasks-heading" className="mt-12 max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
          <h2 id="page-tasks-heading" tabIndex={-1} className="text-h3 text-ink">
            Tasks
          </h2>
          <PageTasksAction />
        </div>
        <PageTasksBody />
      </section>
    </TasksProvider>
  );
}

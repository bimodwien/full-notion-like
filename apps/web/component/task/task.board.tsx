import { Task, TaskStatus } from '@/model/task.model';
import { STATUSES, STATUS_LABEL, tasksWithStatus } from '@/util/task.board';
import { TaskCard } from '@/component/task/task.card';

function TaskColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const headingId = `column-${status}`;
  return (
    <section aria-labelledby={headingId} className="rounded-md bg-canvas-soft p-2">
      <h2
        id={headingId}
        tabIndex={-1}
        className="flex items-baseline gap-2 px-1 pb-2 text-body-sm font-medium text-ink"
      >
        {STATUS_LABEL[status]}
        <span className="text-ink-muted">{tasks.length}</span>
      </h2>
      {tasks.length === 0 ? (
        <p className="px-1 pb-1 text-body-sm text-ink-muted">No tasks</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ul>
      )}
    </section>
  );
}

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {STATUSES.map((status) => (
        <TaskColumn key={status} status={status} tasks={tasksWithStatus(tasks, status)} />
      ))}
    </div>
  );
}

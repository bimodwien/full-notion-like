'use client';

import { TextField } from '@/component/ui/text.field';
import { DescriptionField } from '@/component/task/description.field';
import { PageField } from '@/component/task/page.field';
import { PersonField } from '@/component/task/person.field';
import { PriorityField } from '@/component/task/priority.field';
import { useWorkspaceTasks } from '@/component/task/tasks.context';
import { Task } from '@/model/task.model';

const TITLE_MAX = 200;

export function TaskDetailFields({ task, error }: { task: Task; error?: string }) {
  const { members } = useWorkspaceTasks();
  return (
    <>
      <TextField
        label="Title"
        name="title"
        autoComplete="off"
        maxLength={TITLE_MAX}
        defaultValue={task.title}
        error={error}
      />
      <DescriptionField defaultValue={task.description ?? ''} />
      <div className="grid gap-4 sm:grid-cols-2">
        <PriorityField defaultValue={task.priority} />
        <PageField value={task.documentId} />
        <PersonField
          label="Assignee"
          name="assigneeId"
          emptyLabel="Unassigned"
          value={task.assigneeId}
          members={members}
        />
        <PersonField
          label="Reviewer"
          name="reviewerId"
          emptyLabel="No reviewer"
          value={task.reviewerId}
          members={members}
        />
      </div>
    </>
  );
}

'use client';

import { useRef } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL_WIDE } from '@/component/ui/dialog.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import { useShowModal } from '@/component/ui/use.show.modal';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { DescriptionField } from '@/component/task/description.field';
import { PageField } from '@/component/task/page.field';
import { PersonField } from '@/component/task/person.field';
import { PriorityField } from '@/component/task/priority.field';
import { useTaskDetailForm } from '@/component/task/use.task.detail.form';
import { useMembers } from '@/component/workspace/members/use.members';
import { Task } from '@/model/task.model';
import { STATUS_LABEL } from '@/util/task.board';

const TITLE_MAX = 200;

type Props = { task: Task; onClose: () => void };

// Viewers get the same dialog with every field disabled and no Save button.
export function TaskDetailDialog({ task, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { workspaceId, canEdit } = useWorkspaceDocuments();
  const { state: members } = useMembers(workspaceId);
  const form = useTaskDetailForm(task, () => ref.current?.close());
  useShowModal(ref);

  return (
    <dialog
      ref={ref}
      aria-labelledby="task-detail-heading"
      onClose={onClose}
      className={DIALOG_PANEL_WIDE}
    >
      <h2 id="task-detail-heading" className="text-h3">
        {canEdit ? 'Edit task' : 'Task details'}
      </h2>
      <p className="mt-1 mb-4 text-body-sm text-ink-muted">Status: {STATUS_LABEL[task.status]}</p>
      <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-4">
        <fieldset disabled={!canEdit} className="flex min-w-0 flex-col gap-4">
          <TextField
            label="Title"
            name="title"
            autoComplete="off"
            maxLength={TITLE_MAX}
            defaultValue={task.title}
            error={form.error}
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
        </fieldset>
        <FormAlert message={form.formError} />
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className={buttonStyles('utility')}
          >
            {canEdit ? 'Cancel' : 'Close'}
          </button>
          {canEdit && (
            <button type="submit" disabled={form.pending} className={buttonStyles('primary')}>
              {form.pending ? 'Saving…' : 'Save changes'}
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}

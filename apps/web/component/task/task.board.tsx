'use client';

import { useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '@/model/task.model';
import { STATUSES, STATUS_LABEL, tasksWithStatus } from '@/util/task.board';
import { useBoardSensors } from '@/component/task/board.sensors';
import { DraggableTaskCard, TaskCardPreview } from '@/component/task/draggable.task.card';
import { useMoveTask } from '@/component/task/use.move.task';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { dropTarget } from '@/util/task.drop';

function TaskColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const { setNodeRef, isOver, over } = useDroppable({ id: status });
  const highlighted = isOver || tasks.some((task) => task.id === over?.id);
  const headingId = `column-${status}`;
  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={`rounded-md bg-canvas-soft p-2 ${highlighted ? 'ring-2 ring-primary' : ''}`}
    >
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
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
          </ul>
        </SortableContext>
      )}
    </section>
  );
}

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const sensors = useBoardSensors();
  const move = useMoveTask();
  const [dragged, setDragged] = useState<Task | null>(null);

  function handleDragStart({ active }: DragStartEvent) {
    setDragged((active.data.current?.task as Task | undefined) ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setDragged(null);
    const task = active.data.current?.task as Task | undefined;
    if (!task || !over) return;
    const drop = dropTarget(tasks, task, String(over.id));
    if (drop) move(task, drop);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragged(null)}
    >
      <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((status) => (
          <TaskColumn key={status} status={status} tasks={tasksWithStatus(tasks, status)} />
        ))}
      </div>
      <DragOverlay>{dragged && <TaskCardPreview task={dragged} />}</DragOverlay>
    </DndContext>
  );
}

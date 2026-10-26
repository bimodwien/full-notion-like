'use client';

import { useDraggable } from '@dnd-kit/core';
import { TaskCard } from '@/component/task/task.card';
import { Task } from '@/model/task.model';

export function DraggableTaskCard({ task }: { task: Task }) {
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: task.id, data: { task } });
  return <TaskCard task={task} drag={{ setNodeRef, listeners, isDragging }} />;
}

// What follows the pointer while dragging: the title only, no buttons to tab into.
export function TaskCardPreview({ task }: { task: Task }) {
  return (
    <div className="cursor-grabbing rounded-sm border border-field bg-canvas p-3 text-body-sm text-ink shadow-soft">
      {task.title}
    </div>
  );
}

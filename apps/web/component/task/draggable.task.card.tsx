'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from '@/component/task/task.card';
import { Task } from '@/model/task.model';

export function DraggableTaskCard({ task }: { task: Task }) {
  const { setNodeRef, listeners, isDragging, transform, transition } = useSortable({
    id: task.id,
    data: { task },
  });
  // Translate, not Transform: cards differ in height, so scaling them to fit would squash the text.
  const style = { transform: CSS.Translate.toString(transform), transition };
  return <TaskCard task={task} drag={{ setNodeRef, listeners, isDragging, style }} />;
}

// What follows the pointer while dragging: the title only, no buttons to tab into.
export function TaskCardPreview({ task }: { task: Task }) {
  return (
    <div className="cursor-grabbing rounded-sm border border-field bg-canvas p-3 text-body-sm text-ink shadow-soft">
      {task.title}
    </div>
  );
}

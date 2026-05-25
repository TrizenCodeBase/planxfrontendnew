import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import type { Task, TaskStatus } from '@/types'

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]

function TaskCard({
  task,
  onAssign,
  collaboratorOptions,
}: {
  task: Task
  onAssign: (id: string, assignee: string) => void
  collaboratorOptions: { value: string; label: string }[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 150ms ease',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-[var(--color-border)] rounded-[var(--radius-control)] p-3">
      <p {...attributes} {...listeners} className="text-sm font-medium cursor-grab">{task.title}</p>
      <div className="mt-2 flex flex-col gap-2">
        <Badge label={task.priority} variant={task.priority} />
        <Select
          value={task.assigneeId}
          onChange={(e) => onAssign(task.id, e.target.value)}
          options={collaboratorOptions}
        />
      </div>
    </div>
  )
}

function Column({
  title,
  items,
  onAssign,
  collaboratorOptions,
}: {
  title: string
  items: Task[]
  onAssign: (id: string, assignee: string) => void
  collaboratorOptions: { value: string; label: string }[]
}) {
  return (
    <div className="flex-1 min-w-[220px] bg-white border border-[var(--color-border)] rounded-[var(--radius-control)] p-3">
      <h3 className="text-sm font-semibold mb-3">{title} ({items.length})</h3>
      <SortableContext items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[60px]">
          {items.map((task) => (
            <TaskCard key={task.id} task={task} onAssign={onAssign} collaboratorOptions={collaboratorOptions} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export function ManagerSprintBoard() {
  const { tasks, sprints, collaborators, toast, setToast, updateTask, assignTask } = usePlanXStore()
  const collaboratorOptions = collaborators.map((c) => ({ value: c.id, label: c.name }))
  const activeSprint = sprints.find((s) => s.status === 'active') ?? sprints[0]
  const sprintTasks = tasks.filter((t) => t.sprintId === activeSprint?.id)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return
    const task = sprintTasks.find((t) => t.id === active.id)
    if (!task) return
    let newStatus = task.status
    if (COLUMNS.some((c) => c.id === over.id)) newStatus = over.id as TaskStatus
    else {
      const overTask = sprintTasks.find((t) => t.id === over.id)
      if (overTask) newStatus = overTask.status
    }
    if (newStatus !== task.status) updateTask(task.id, { status: newStatus })
  }

  const activeTask = activeId ? sprintTasks.find((t) => t.id === activeId) : null

  return (
    <div>
      <PageHeader title="Sprint Board" description={`${activeSprint?.name ?? 'Sprint'} — drag tasks and assign collaborators`} />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              title={col.title}
              items={sprintTasks.filter((t) => t.status === col.id)}
              onAssign={assignTask}
              collaboratorOptions={collaboratorOptions}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-control)] p-3 w-[200px]">
              <p className="text-sm font-medium">{activeTask.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

import type { Sprint } from '@/types'

export const sprints: Sprint[] = [
  {
    id: 'spr-1',
    name: 'Sprint 24 — Q2 Launch',
    projectId: 'proj-1',
    startDate: '2025-05-01',
    endDate: '2025-05-14',
    status: 'active',
    taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'],
  },
  {
    id: 'spr-2',
    name: 'Sprint 23 — Auth MVP',
    projectId: 'proj-1',
    startDate: '2025-04-15',
    endDate: '2025-04-28',
    status: 'completed',
    taskIds: ['task-6', 'task-7'],
  },
  {
    id: 'spr-3',
    name: 'Sprint 1 — Mobile Alpha',
    projectId: 'proj-2',
    startDate: '2025-05-10',
    endDate: '2025-05-24',
    status: 'planned',
    taskIds: ['task-8'],
  },
]

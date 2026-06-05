export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  sprintId?: string
  epicId?: string
  assigneeId: string
  reporterId: string
  labels: string[]
  dueDate?: string
  createdAt: string
  comments: TaskComment[]
}

export interface TaskComment {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  key: string
  organizationId: string
  description: string
  status: 'active' | 'archived'
  collaboratorIds: string[]
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro' | 'enterprise'
  collaboratorCount: number
  projectCount: number
  createdAt: string
  status: 'active' | 'suspended'
  adminEmail?: string
  inviteStatus?: 'sent' | 'pending' | 'failed'
  inviteSentAt?: string
}

export interface Sprint {
  id: string
  name: string
  projectId: string
  startDate: string
  endDate: string
  status: 'planned' | 'active' | 'completed'
  taskIds: string[]
}

export interface Epic {
  id: string
  name: string
  projectId: string
  description: string
  status: 'open' | 'in_progress' | 'done'
  taskCount: number
}

export interface Collaborator {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive'
  organizationId: string
}

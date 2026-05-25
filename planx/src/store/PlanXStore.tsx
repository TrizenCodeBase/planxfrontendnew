import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { organizations as seedOrgs } from '@/mock/organizations'
import { projects as seedProjects, epics as seedEpics, labels as seedLabels } from '@/mock/projects'
import { tasks as seedTasks } from '@/mock/tasks'
import { sprints as seedSprints } from '@/mock/sprints'
import { collaborators as seedCollaborators } from '@/mock/users'
import { initialPayments } from '@/mock/billing'
import { initialAuditLogs, initialSessions } from '@/mock/security'
import type { Organization, Project, Task, Sprint, Epic, Collaborator, TaskComment } from '@/types'
import type { PlatformUser, PaymentRecord, AuditLog, PlatformSession, InviteRecord } from '@/types/platform'
import type { UserRole } from '@/types/auth'

const STORAGE_KEY = 'planx_store_v3'

interface StoreState {
  organizations: Organization[]
  projects: Project[]
  tasks: Task[]
  sprints: Sprint[]
  epics: Epic[]
  labels: { id: string; name: string; color: string }[]
  collaborators: Collaborator[]
  platformUsers: PlatformUser[]
  payments: PaymentRecord[]
  auditLogs: AuditLog[]
  sessions: PlatformSession[]
  invites: InviteRecord[]
}

function seedPlatformUsers(): PlatformUser[] {
  return [
    ...seedCollaborators.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      role: c.role as UserRole,
      organizationId: c.organizationId,
      organizationName: 'Trizen Ventures',
      status: c.status === 'active' ? ('active' as const) : ('inactive' as const),
      createdAt: '2024-06-01',
    })),
    {
      id: 'u-sys-1',
      name: 'System Administrator',
      email: 'demo@trizenventures.com',
      role: 'SYSTEM_ADMIN' as UserRole,
      status: 'active' as const,
      createdAt: '2024-01-01',
    },
    {
      id: 'u-view-1',
      name: 'Read Only Viewer',
      email: 'viewer@trizenventures.com',
      role: 'VIEWER' as UserRole,
      organizationId: 'org-1',
      organizationName: 'Trizen Ventures',
      status: 'active' as const,
      createdAt: '2025-03-01',
    },
  ]
}

function getInitialState(): StoreState {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as StoreState
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
  return {
    organizations: [...seedOrgs],
    projects: [...seedProjects],
    tasks: [...seedTasks],
    sprints: [...seedSprints],
    epics: [...seedEpics],
    labels: [...seedLabels],
    collaborators: [...seedCollaborators],
    platformUsers: seedPlatformUsers(),
    payments: [...initialPayments],
    auditLogs: [...initialAuditLogs],
    sessions: [...initialSessions],
    invites: [],
  }
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

interface PlanXStoreValue extends StoreState {
  toast: string
  setToast: (msg: string) => void
  addAuditLog: (action: string, actor: string, target: string) => void
  // Organizations
  createOrganization: (data: { name: string; slug: string; plan: Organization['plan']; adminEmail: string }) => Organization
  updateOrganization: (id: string, data: Partial<Organization>) => void
  suspendOrganization: (id: string) => void
  deleteOrganization: (id: string) => void
  getOrgStats: (id: string) => { users: number; projects: number; tasks: number }
  // Platform users
  createPlatformUser: (data: { name: string; email: string; role: UserRole; organizationId?: string }) => PlatformUser
  updatePlatformUser: (id: string, data: Partial<PlatformUser>) => void
  deletePlatformUser: (id: string) => void
  changeUserRole: (id: string, role: UserRole) => void
  // Billing
  changeOrgPlan: (orgId: string, plan: Organization['plan']) => void
  // Sessions
  revokeSession: (id: string) => void
  // Projects
  createProject: (data: Omit<Project, 'id' | 'createdAt'>) => Project
  deleteProject: (id: string) => void
  updateProject: (id: string, data: Partial<Project>) => void
  // Collaborators
  inviteCollaborator: (data: { email: string; name: string; role: string; department: string }) => void
  removeCollaborator: (id: string) => void
  updateCollaboratorRole: (id: string, role: string) => void
  // Labels
  createLabel: (name: string, color: string) => void
  deleteLabel: (id: string) => void
  // Sprints
  createSprint: (data: Omit<Sprint, 'id' | 'taskIds'>) => Sprint
  updateSprint: (id: string, data: Partial<Sprint>) => void
  deleteSprint: (id: string) => void
  // Epics
  createEpic: (data: Omit<Epic, 'id' | 'taskCount'>) => Epic
  updateEpic: (id: string, data: Partial<Epic>) => void
  deleteEpic: (id: string) => void
  // Tasks
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'comments'>) => Task
  updateTask: (id: string, data: Partial<Task>) => void
  deleteTask: (id: string) => void
  assignTask: (taskId: string, assigneeId: string) => void
  addTaskComment: (taskId: string, comment: Omit<TaskComment, 'id'>) => void
  moveTaskToSprint: (taskId: string, sprintId: string | undefined) => void
}

const PlanXStoreContext = createContext<PlanXStoreValue | null>(null)

export function PlanXStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(getInitialState)
  const [toast, setToast] = useState('')

  const persist = useCallback((next: StoreState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addAuditLog = useCallback(
    (action: string, actor: string, target: string) => {
      const log: AuditLog = {
        id: uid('log'),
        action,
        actor,
        target,
        timestamp: new Date().toISOString(),
        ip: '192.168.1.10',
      }
      persist({ ...state, auditLogs: [log, ...state.auditLogs].slice(0, 100) })
    },
    [state, persist]
  )

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }, [])

  const createOrganization = useCallback(
    (data: { name: string; slug: string; plan: Organization['plan']; adminEmail: string }) => {
      const org: Organization = {
        id: uid('org'),
        name: data.name,
        slug: data.slug,
        plan: data.plan,
        collaboratorCount: 1,
        projectCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        status: 'active',
      }
      const invite: InviteRecord = {
        id: uid('inv'),
        email: data.adminEmail,
        type: 'org_admin',
        organizationId: org.id,
        sentAt: new Date().toISOString(),
        status: 'sent',
      }
      const next = {
        ...state,
        organizations: [...state.organizations, org],
        invites: [...state.invites, invite],
      }
      persist(next)
      addAuditLog('Organization created', 'System Administrator', org.name)
      showToast(`Organization "${org.name}" created. Admin invite sent to ${data.adminEmail}.`)
      return org
    },
    [state, persist, addAuditLog, showToast]
  )

  const updateOrganization = useCallback(
    (id: string, data: Partial<Organization>) => {
      persist({
        ...state,
        organizations: state.organizations.map((o) => (o.id === id ? { ...o, ...data } : o)),
      })
      addAuditLog('Organization updated', 'System Administrator', id)
      showToast('Organization updated.')
    },
    [state, persist, addAuditLog, showToast]
  )

  const suspendOrganization = useCallback(
    (id: string) => {
      persist({
        ...state,
        organizations: state.organizations.map((o) =>
          o.id === id ? { ...o, status: 'suspended' as const } : o
        ),
      })
      addAuditLog('Organization suspended', 'System Administrator', id)
      showToast('Organization suspended.')
    },
    [state, persist, addAuditLog, showToast]
  )

  const deleteOrganization = useCallback(
    (id: string) => {
      persist({
        ...state,
        organizations: state.organizations.filter((o) => o.id !== id),
        projects: state.projects.filter((p) => p.organizationId !== id),
      })
      addAuditLog('Organization deleted', 'System Administrator', id)
      showToast('Organization deleted.')
    },
    [state, persist, addAuditLog, showToast]
  )

  const getOrgStats = useCallback(
    (id: string) => ({
      users: state.platformUsers.filter((u) => u.organizationId === id).length,
      projects: state.projects.filter((p) => p.organizationId === id).length,
      tasks: state.tasks.filter((t) =>
        state.projects.some((p) => p.id === t.projectId && p.organizationId === id)
      ).length,
    }),
    [state]
  )

  const createPlatformUser = useCallback(
    (data: { name: string; email: string; role: UserRole; organizationId?: string }) => {
      const org = state.organizations.find((o) => o.id === data.organizationId)
      const user: PlatformUser = {
        id: uid('u'),
        name: data.name,
        email: data.email,
        role: data.role,
        organizationId: data.organizationId,
        organizationName: org?.name,
        status: 'invited',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      const invite: InviteRecord = {
        id: uid('inv'),
        email: data.email,
        type: 'user',
        organizationId: data.organizationId,
        sentAt: new Date().toISOString(),
        status: 'sent',
      }
      persist({
        ...state,
        platformUsers: [...state.platformUsers, user],
        invites: [...state.invites, invite],
      })
      addAuditLog('User created', 'System Administrator', data.email)
      showToast(`User created. Invitation email sent to ${data.email}.`)
      return user
    },
    [state, persist, addAuditLog, showToast]
  )

  const updatePlatformUser = useCallback(
    (id: string, data: Partial<PlatformUser>) => {
      persist({
        ...state,
        platformUsers: state.platformUsers.map((u) => (u.id === id ? { ...u, ...data } : u)),
      })
      showToast('User updated.')
    },
    [state, persist, showToast]
  )

  const deletePlatformUser = useCallback(
    (id: string) => {
      const user = state.platformUsers.find((u) => u.id === id)
      persist({ ...state, platformUsers: state.platformUsers.filter((u) => u.id !== id) })
      addAuditLog('User deleted', 'System Administrator', user?.email ?? id)
      showToast('User deleted.')
    },
    [state, persist, addAuditLog, showToast]
  )

  const changeUserRole = useCallback(
    (id: string, role: UserRole) => {
      persist({
        ...state,
        platformUsers: state.platformUsers.map((u) => (u.id === id ? { ...u, role } : u)),
      })
      addAuditLog('User role changed', 'System Administrator', `${id} → ${role}`)
      showToast('User role updated.')
    },
    [state, persist, addAuditLog, showToast]
  )

  const changeOrgPlan = useCallback(
    (orgId: string, plan: Organization['plan']) => {
      const org = state.organizations.find((o) => o.id === orgId)
      persist({
        ...state,
        organizations: state.organizations.map((o) => (o.id === orgId ? { ...o, plan } : o)),
        payments: [
          {
            id: uid('pay'),
            organizationId: orgId,
            organizationName: org?.name ?? '',
            amount: plan === 'free' ? 0 : plan === 'pro' ? 299 : 999,
            plan,
            status: 'paid',
            date: new Date().toISOString().slice(0, 10),
          },
          ...state.payments,
        ],
      })
      addAuditLog('Plan changed', 'System Administrator', `${org?.name} → ${plan}`)
      showToast(`Plan changed to ${plan}.`)
    },
    [state, persist, addAuditLog, showToast]
  )

  const revokeSession = useCallback(
    (id: string) => {
      const sess = state.sessions.find((s) => s.id === id)
      persist({ ...state, sessions: state.sessions.filter((s) => s.id !== id) })
      addAuditLog('Session revoked', 'System Administrator', sess?.userName ?? id)
      showToast('Session revoked.')
    },
    [state, persist, addAuditLog, showToast]
  )

  const createProject = useCallback(
    (data: Omit<Project, 'id' | 'createdAt'>) => {
      const project: Project = { ...data, id: uid('proj'), createdAt: new Date().toISOString().slice(0, 10) }
      persist({ ...state, projects: [...state.projects, project] })
      showToast(`Project "${project.name}" created.`)
      return project
    },
    [state, persist, showToast]
  )

  const deleteProject = useCallback(
    (id: string) => {
      persist({
        ...state,
        projects: state.projects.filter((p) => p.id !== id),
        tasks: state.tasks.filter((t) => t.projectId !== id),
      })
      showToast('Project deleted.')
    },
    [state, persist, showToast]
  )

  const updateProject = useCallback(
    (id: string, data: Partial<Project>) => {
      persist({ ...state, projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)) })
      showToast('Project settings saved.')
    },
    [state, persist, showToast]
  )

  const inviteCollaborator = useCallback(
    (data: { email: string; name: string; role: string; department: string }) => {
      const collab: Collaborator = {
        id: uid('u'),
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        status: 'active',
        organizationId: 'org-1',
      }
      persist({
        ...state,
        collaborators: [...state.collaborators, collab],
        invites: [
          ...state.invites,
          { id: uid('inv'), email: data.email, type: 'user', organizationId: 'org-1', sentAt: new Date().toISOString(), status: 'sent' },
        ],
      })
      showToast(`Invite sent to ${data.email}.`)
    },
    [state, persist, showToast]
  )

  const removeCollaborator = useCallback(
    (id: string) => {
      persist({ ...state, collaborators: state.collaborators.filter((c) => c.id !== id) })
      showToast('Collaborator removed.')
    },
    [state, persist, showToast]
  )

  const updateCollaboratorRole = useCallback(
    (id: string, role: string) => {
      persist({
        ...state,
        collaborators: state.collaborators.map((c) => (c.id === id ? { ...c, role } : c)),
      })
      showToast('Role assigned.')
    },
    [state, persist, showToast]
  )

  const createLabel = useCallback(
    (name: string, color: string) => {
      persist({ ...state, labels: [...state.labels, { id: uid('lbl'), name, color }] })
      showToast('Label created.')
    },
    [state, persist, showToast]
  )

  const deleteLabel = useCallback(
    (id: string) => {
      persist({ ...state, labels: state.labels.filter((l) => l.id !== id) })
      showToast('Label deleted.')
    },
    [state, persist, showToast]
  )

  const createSprint = useCallback(
    (data: Omit<Sprint, 'id' | 'taskIds'>) => {
      const sprint: Sprint = { ...data, id: uid('spr'), taskIds: [] }
      persist({ ...state, sprints: [...state.sprints, sprint] })
      showToast(`Sprint "${sprint.name}" created.`)
      return sprint
    },
    [state, persist, showToast]
  )

  const updateSprint = useCallback(
    (id: string, data: Partial<Sprint>) => {
      persist({ ...state, sprints: state.sprints.map((s) => (s.id === id ? { ...s, ...data } : s)) })
      showToast('Sprint updated.')
    },
    [state, persist, showToast]
  )

  const deleteSprint = useCallback(
    (id: string) => {
      persist({ ...state, sprints: state.sprints.filter((s) => s.id !== id) })
      showToast('Sprint deleted.')
    },
    [state, persist, showToast]
  )

  const createEpic = useCallback(
    (data: Omit<Epic, 'id' | 'taskCount'>) => {
      const epic: Epic = { ...data, id: uid('epic'), taskCount: 0 }
      persist({ ...state, epics: [...state.epics, epic] })
      showToast(`Epic "${epic.name}" created.`)
      return epic
    },
    [state, persist, showToast]
  )

  const updateEpic = useCallback(
    (id: string, data: Partial<Epic>) => {
      persist({ ...state, epics: state.epics.map((e) => (e.id === id ? { ...e, ...data } : e)) })
      showToast('Epic updated.')
    },
    [state, persist, showToast]
  )

  const deleteEpic = useCallback(
    (id: string) => {
      persist({ ...state, epics: state.epics.filter((e) => e.id !== id) })
      showToast('Epic deleted.')
    },
    [state, persist, showToast]
  )

  const createTask = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
      const task: Task = {
        ...data,
        id: uid('task'),
        createdAt: new Date().toISOString().slice(0, 10),
        comments: [],
      }
      persist({ ...state, tasks: [...state.tasks, task] })
      showToast('Issue created.')
      return task
    },
    [state, persist, showToast]
  )

  const updateTask = useCallback(
    (id: string, data: Partial<Task>) => {
      persist({ ...state, tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) })
    },
    [state, persist]
  )

  const deleteTask = useCallback(
    (id: string) => {
      persist({ ...state, tasks: state.tasks.filter((t) => t.id !== id) })
      showToast('Task removed from backlog.')
    },
    [state, persist, showToast]
  )

  const assignTask = useCallback(
    (taskId: string, assigneeId: string) => {
      persist({
        ...state,
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, assigneeId } : t)),
      })
      showToast('Task assigned.')
    },
    [state, persist, showToast]
  )

  const addTaskComment = useCallback(
    (taskId: string, comment: Omit<TaskComment, 'id'>) => {
      persist({
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, comments: [...t.comments, { ...comment, id: uid('c') }] }
            : t
        ),
      })
    },
    [state, persist]
  )

  const moveTaskToSprint = useCallback(
    (taskId: string, sprintId: string | undefined) => {
      persist({
        ...state,
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, sprintId } : t)),
      })
      showToast(sprintId ? 'Task added to sprint.' : 'Task moved to backlog.')
    },
    [state, persist, showToast]
  )

  const value = useMemo(
    () => ({
      ...state,
      toast,
      setToast,
      addAuditLog,
      createOrganization,
      updateOrganization,
      suspendOrganization,
      deleteOrganization,
      getOrgStats,
      createPlatformUser,
      updatePlatformUser,
      deletePlatformUser,
      changeUserRole,
      changeOrgPlan,
      revokeSession,
      createProject,
      deleteProject,
      updateProject,
      inviteCollaborator,
      removeCollaborator,
      updateCollaboratorRole,
      createLabel,
      deleteLabel,
      createSprint,
      updateSprint,
      deleteSprint,
      createEpic,
      updateEpic,
      deleteEpic,
      createTask,
      updateTask,
      deleteTask,
      assignTask,
      addTaskComment,
      moveTaskToSprint,
    }),
    [
      state,
      toast,
      addAuditLog,
      createOrganization,
      updateOrganization,
      suspendOrganization,
      deleteOrganization,
      getOrgStats,
      createPlatformUser,
      updatePlatformUser,
      deletePlatformUser,
      changeUserRole,
      changeOrgPlan,
      revokeSession,
      createProject,
      deleteProject,
      updateProject,
      inviteCollaborator,
      removeCollaborator,
      updateCollaboratorRole,
      createLabel,
      deleteLabel,
      createSprint,
      updateSprint,
      deleteSprint,
      createEpic,
      updateEpic,
      deleteEpic,
      createTask,
      updateTask,
      deleteTask,
      assignTask,
      addTaskComment,
      moveTaskToSprint,
    ]
  )

  return <PlanXStoreContext.Provider value={value}>{children}</PlanXStoreContext.Provider>
}

export function usePlanXStore() {
  const ctx = useContext(PlanXStoreContext)
  if (!ctx) throw new Error('usePlanXStore must be used within PlanXStoreProvider')
  return ctx
}

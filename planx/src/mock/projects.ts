import type { Epic, Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'PlanX Core',
    key: 'PXC',
    organizationId: 'org-1',
    description: 'Core platform rebuild and SaaS foundation.',
    status: 'active',
    collaboratorIds: ['u-adm-1', 'u-mgr-1', 'u-mem-1', 'u-mem-2'],
    createdAt: '2025-01-10',
  },
  {
    id: 'proj-2',
    name: 'Mobile App',
    key: 'MOB',
    organizationId: 'org-1',
    description: 'Cross-platform mobile client for PlanX.',
    status: 'active',
    collaboratorIds: ['u-mgr-1', 'u-mem-1'],
    createdAt: '2025-02-20',
  },
  {
    id: 'proj-3',
    name: 'Marketing Site',
    key: 'MKT',
    organizationId: 'org-1',
    description: 'Public marketing and documentation site.',
    status: 'active',
    collaboratorIds: ['u-adm-1', 'u-mem-3'],
    createdAt: '2025-03-05',
  },
]

export const epics: Epic[] = [
  {
    id: 'epic-1',
    name: 'Authentication & RBAC',
    projectId: 'proj-1',
    description: 'Mock auth, role routing, and access control.',
    status: 'in_progress',
    taskCount: 8,
  },
  {
    id: 'epic-2',
    name: 'Dashboard Analytics',
    projectId: 'proj-1',
    description: 'Role-specific dashboards and reporting widgets.',
    status: 'open',
    taskCount: 5,
  },
  {
    id: 'epic-3',
    name: 'Sprint Management',
    projectId: 'proj-1',
    description: 'Sprint boards, backlog, and task workflows.',
    status: 'in_progress',
    taskCount: 12,
  },
  {
    id: 'epic-4',
    name: 'Onboarding Flow',
    projectId: 'proj-2',
    description: 'First-run experience for new collaborators.',
    status: 'open',
    taskCount: 4,
  },
]

export const labels = [
  { id: 'lbl-1', name: 'Bug', color: '#dc2626' },
  { id: 'lbl-2', name: 'Feature', color: '#2563eb' },
  { id: 'lbl-3', name: 'Enhancement', color: '#7c3aed' },
  { id: 'lbl-4', name: 'Documentation', color: '#059669' },
  { id: 'lbl-5', name: 'Design', color: '#d97706' },
]

import type { UserRole } from '@/types/auth'
import type { SubNavTab } from './SubNav'

const SYSTEM_ADMIN_TABS: SubNavTab[] = [
  { label: 'Overview', path: '/system-admin', end: true },
  { label: 'Organizations', path: '/system-admin/organizations' },
  { label: 'Users', path: '/system-admin/users' },
  { label: 'Billing', path: '/system-admin/billing' },
  { label: 'Security', path: '/system-admin/security' },
]

const ADMIN_TABS: SubNavTab[] = [
  { label: 'Dashboard', path: '/admin', end: true },
  { label: 'Projects', path: '/admin/projects' },
  { label: 'Collaborators', path: '/admin/collaborators' },
  { label: 'Roles', path: '/admin/roles' },
  { label: 'Labels', path: '/admin/labels' },
  { label: 'Settings', path: '/admin/settings' },
]

const MANAGER_TABS: SubNavTab[] = [
  { label: 'Sprint Board', path: '/manager', end: true },
  { label: 'Sprints', path: '/manager/sprints' },
  { label: 'Backlog', path: '/manager/backlog' },
  { label: 'Epics', path: '/manager/epics' },
  { label: 'Reports', path: '/manager/reports' },
]

const MEMBER_TABS: SubNavTab[] = [
  { label: 'My Issues', path: '/member', end: true },
  { label: 'Kanban', path: '/member/kanban' },
]

const VIEWER_TABS: SubNavTab[] = [
  { label: 'Issues', path: '/viewer', end: true },
]

export function getSubNavTabs(role: UserRole | undefined): SubNavTab[] {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return SYSTEM_ADMIN_TABS
    case 'ADMIN':
      return ADMIN_TABS
    case 'MANAGER':
      return MANAGER_TABS
    case 'MEMBER':
      return MEMBER_TABS
    case 'VIEWER':
      return VIEWER_TABS
    default:
      return []
  }
}

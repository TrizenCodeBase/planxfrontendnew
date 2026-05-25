import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Shield,
  FolderKanban,
  Tags,
  Settings,
  UserCircle,
  Calendar,
  FileText,
  Layers,
  ListTodo,
  Kanban,
  ClipboardList,
  Eye,
} from 'lucide-react'
import { useRole } from '@/hooks/useRole'
import { canAccess } from '@/utils/rbac'
import type { UserRole } from '@/types/auth'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  roles: UserRole[]
}

interface NavGroup {
  heading: string
  roles: UserRole[]
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'SYSTEM SUPPORT',
    roles: ['SYSTEM_ADMIN'],
    items: [
      { label: 'Dashboard', path: '/system-admin', icon: <LayoutDashboard size={16} />, roles: ['SYSTEM_ADMIN'] },
      { label: 'Organizations', path: '/system-admin/organizations', icon: <Building2 size={16} />, roles: ['SYSTEM_ADMIN'] },
      { label: 'Users', path: '/system-admin/users', icon: <Users size={16} />, roles: ['SYSTEM_ADMIN'] },
      { label: 'Billing', path: '/system-admin/billing', icon: <CreditCard size={16} />, roles: ['SYSTEM_ADMIN'] },
      { label: 'Security', path: '/system-admin/security', icon: <Shield size={16} />, roles: ['SYSTEM_ADMIN'] },
    ],
  },
  {
    heading: 'ORGANIZATION',
    roles: ['ADMIN'],
    items: [
      { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={16} />, roles: ['ADMIN'] },
      { label: 'Projects', path: '/admin/projects', icon: <FolderKanban size={16} />, roles: ['ADMIN'] },
      { label: 'Collaborators', path: '/admin/collaborators', icon: <Users size={16} />, roles: ['ADMIN'] },
      { label: 'Roles', path: '/admin/roles', icon: <UserCircle size={16} />, roles: ['ADMIN'] },
      { label: 'Labels', path: '/admin/labels', icon: <Tags size={16} />, roles: ['ADMIN'] },
      { label: 'Settings', path: '/admin/settings', icon: <Settings size={16} />, roles: ['ADMIN'] },
    ],
  },
  {
    heading: 'DELIVERY',
    roles: ['MANAGER'],
    items: [
      { label: 'Sprint Board', path: '/manager', icon: <Kanban size={16} />, roles: ['MANAGER'] },
      { label: 'Sprints', path: '/manager/sprints', icon: <Calendar size={16} />, roles: ['MANAGER'] },
      { label: 'Backlog', path: '/manager/backlog', icon: <ListTodo size={16} />, roles: ['MANAGER'] },
      { label: 'Epics', path: '/manager/epics', icon: <Layers size={16} />, roles: ['MANAGER'] },
      { label: 'Reports', path: '/manager/reports', icon: <FileText size={16} />, roles: ['MANAGER'] },
    ],
  },
  {
    heading: 'MY WORK',
    roles: ['MEMBER'],
    items: [
      { label: 'My Issues', path: '/member', icon: <ClipboardList size={16} />, roles: ['MEMBER'] },
      { label: 'Kanban', path: '/member/kanban', icon: <Kanban size={16} />, roles: ['MEMBER'] },
    ],
  },
  {
    heading: 'READ ONLY',
    roles: ['VIEWER'],
    items: [
      { label: 'Issues', path: '/viewer', icon: <Eye size={16} />, roles: ['VIEWER'] },
    ],
  },
]

const DASHBOARD_PATHS = ['/system-admin', '/admin', '/manager', '/member', '/viewer']

export function Sidebar() {
  const { role } = useRole()
  const groups = NAV_GROUPS.filter((g) => canAccess(role, g.roles))

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-[var(--color-border)] flex flex-col overflow-y-auto">
      <nav className="flex-1 py-3">
        {groups.map((group) => (
          <div key={group.heading} className="mb-4">
            <p className="px-4 mb-1 text-[10px] font-semibold tracking-wider text-[var(--color-nav-heading)]">
              {group.heading}
            </p>
            <ul className="space-y-0">
              {group.items
                .filter((item) => canAccess(role, item.roles))
                .map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={DASHBOARD_PATHS.includes(item.path)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 mx-2 px-2 py-1.5 text-sm rounded-[var(--radius-control)] transition-colors duration-150 ${
                          isActive
                            ? 'bg-[#deebff] text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]'
                        }`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

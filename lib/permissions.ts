import { PlanXRole, AccessLevel } from './types';

// --- Access Level Symbols ---
export const ACCESS_SYMBOLS: Record<AccessLevel, string> = {
  full: '✓',
  read_only: '◎',
  limited: '~',
  own_only: '⊕',
  none: '✗',
};

// --- Permission Domains ---
export type PermissionDomain =
  | 'dashboard' | 'issues' | 'board' | 'backlog' | 'timeline'
  | 'calendar' | 'dependencies' | 'reports' | 'sprint' | 'ai'
  | 'team' | 'integrations' | 'settings' | 'enterprise' | 'whitelabel'
  | 'audit' | 'billing' | 'security' | 'pull_requests' | 'time_tracking'
  | 'qa' | 'inbox' | 'workflow' | 'custom_fields' | 'automation'
  | 'releases' | 'labels' | 'components' | 'capacity' | 'comments'
  | 'watching';

// --- Granular Permission Keys ---
export type Permission =
  // Dashboard
  | 'dashboard.view' | 'dashboard.admin_analytics' | 'dashboard.sprint_progress'
  | 'dashboard.assigned_tasks' | 'dashboard.bug_queue' | 'dashboard.project_overview'
  | 'dashboard.system_health' | 'dashboard.ai_insights' | 'dashboard.workload'
  | 'dashboard.capacity' | 'dashboard.org_overview' | 'dashboard.security_alerts'
  | 'dashboard.sla_metrics'
  // Issues
  | 'issues.create' | 'issues.edit' | 'issues.delete' | 'issues.assign'
  | 'issues.change_status' | 'issues.view' | 'issues.comment' | 'issues.manage_labels'
  | 'issues.edit_own' | 'issues.view_own' | 'issues.transition_qa'
  // Board
  | 'board.view' | 'board.drag_drop'
  // Backlog
  | 'backlog.view' | 'backlog.manage'
  // Timeline & Calendar
  | 'timeline.view' | 'calendar.view'
  // Dependencies
  | 'dependencies.view'
  // Reports
  | 'reports.view' | 'reports.manage'
  // Sprint
  | 'sprint.create' | 'sprint.manage' | 'sprint.view'
  // AI
  | 'ai.use'
  // Team
  | 'team.view' | 'team.manage' | 'team.invite'
  // Integrations
  | 'integrations.view' | 'integrations.manage'
  // Settings
  | 'settings.view' | 'settings.manage'
  // Enterprise
  | 'enterprise.manage' | 'whitelabel.manage'
  // Audit & Billing & Security
  | 'audit.view' | 'billing.view' | 'billing.manage' | 'security.manage'
  // Developer tools
  | 'pull_requests.view' | 'pull_requests.manage' | 'time_tracking.view' | 'time_tracking.manage'
  // QA
  | 'qa.verify' | 'qa.reopen' | 'qa.testing_queue' | 'qa.sla_tracking'
  // Inbox
  | 'inbox.view'
  // Admin tools
  | 'workflow.manage' | 'custom_fields.manage' | 'automation.manage'
  | 'releases.manage' | 'labels.manage' | 'components.manage'
  // Manager tools
  | 'capacity.manage' | 'capacity.view'
  // Viewer
  | 'comments.create' | 'watching.manage';

// --- Permission Matrix ---
// Access levels per role per domain action
const PERMISSION_MATRIX: Record<PlanXRole, Record<Permission, AccessLevel>> = {
  super_admin: {
    'dashboard.view': 'full', 'dashboard.admin_analytics': 'full', 'dashboard.sprint_progress': 'full',
    'dashboard.assigned_tasks': 'full', 'dashboard.bug_queue': 'full', 'dashboard.project_overview': 'full',
    'dashboard.system_health': 'full', 'dashboard.ai_insights': 'full', 'dashboard.workload': 'full',
    'dashboard.capacity': 'full', 'dashboard.org_overview': 'full', 'dashboard.security_alerts': 'full',
    'dashboard.sla_metrics': 'full',
    'issues.create': 'full', 'issues.edit': 'full', 'issues.delete': 'full', 'issues.assign': 'full',
    'issues.change_status': 'full', 'issues.view': 'full', 'issues.comment': 'full', 'issues.manage_labels': 'full',
    'issues.edit_own': 'full', 'issues.view_own': 'full', 'issues.transition_qa': 'full',
    'board.view': 'full', 'board.drag_drop': 'full',
    'backlog.view': 'full', 'backlog.manage': 'full',
    'timeline.view': 'full', 'calendar.view': 'full',
    'dependencies.view': 'full',
    'reports.view': 'full', 'reports.manage': 'full',
    'sprint.create': 'full', 'sprint.manage': 'full', 'sprint.view': 'full',
    'ai.use': 'full',
    'team.view': 'full', 'team.manage': 'full', 'team.invite': 'full',
    'integrations.view': 'full', 'integrations.manage': 'full',
    'settings.view': 'full', 'settings.manage': 'full',
    'enterprise.manage': 'full', 'whitelabel.manage': 'full',
    'audit.view': 'full', 'billing.view': 'full', 'billing.manage': 'full', 'security.manage': 'full',
    'pull_requests.view': 'full', 'pull_requests.manage': 'full', 'time_tracking.view': 'full', 'time_tracking.manage': 'full',
    'qa.verify': 'full', 'qa.reopen': 'full', 'qa.testing_queue': 'full', 'qa.sla_tracking': 'full',
    'inbox.view': 'full',
    'workflow.manage': 'full', 'custom_fields.manage': 'full', 'automation.manage': 'full',
    'releases.manage': 'full', 'labels.manage': 'full', 'components.manage': 'full',
    'capacity.manage': 'full', 'capacity.view': 'full',
    'comments.create': 'full', 'watching.manage': 'full',
  },
  admin: {
    'dashboard.view': 'full', 'dashboard.admin_analytics': 'full', 'dashboard.sprint_progress': 'full',
    'dashboard.assigned_tasks': 'full', 'dashboard.bug_queue': 'read_only', 'dashboard.project_overview': 'full',
    'dashboard.system_health': 'read_only', 'dashboard.ai_insights': 'full', 'dashboard.workload': 'full',
    'dashboard.capacity': 'full', 'dashboard.org_overview': 'none', 'dashboard.security_alerts': 'read_only',
    'dashboard.sla_metrics': 'read_only',
    'issues.create': 'full', 'issues.edit': 'full', 'issues.delete': 'full', 'issues.assign': 'full',
    'issues.change_status': 'full', 'issues.view': 'full', 'issues.comment': 'full', 'issues.manage_labels': 'full',
    'issues.edit_own': 'full', 'issues.view_own': 'full', 'issues.transition_qa': 'full',
    'board.view': 'full', 'board.drag_drop': 'full',
    'backlog.view': 'full', 'backlog.manage': 'full',
    'timeline.view': 'full', 'calendar.view': 'full',
    'dependencies.view': 'full',
    'reports.view': 'full', 'reports.manage': 'full',
    'sprint.create': 'full', 'sprint.manage': 'full', 'sprint.view': 'full',
    'ai.use': 'full',
    'team.view': 'full', 'team.manage': 'full', 'team.invite': 'full',
    'integrations.view': 'full', 'integrations.manage': 'full',
    'settings.view': 'full', 'settings.manage': 'full',
    'enterprise.manage': 'none', 'whitelabel.manage': 'none',
    'audit.view': 'read_only', 'billing.view': 'read_only', 'billing.manage': 'none', 'security.manage': 'none',
    'pull_requests.view': 'full', 'pull_requests.manage': 'full', 'time_tracking.view': 'full', 'time_tracking.manage': 'full',
    'qa.verify': 'limited', 'qa.reopen': 'limited', 'qa.testing_queue': 'read_only', 'qa.sla_tracking': 'read_only',
    'inbox.view': 'full',
    'workflow.manage': 'full', 'custom_fields.manage': 'full', 'automation.manage': 'full',
    'releases.manage': 'full', 'labels.manage': 'full', 'components.manage': 'full',
    'capacity.manage': 'full', 'capacity.view': 'full',
    'comments.create': 'full', 'watching.manage': 'full',
  },
  manager: {
    'dashboard.view': 'full', 'dashboard.admin_analytics': 'none', 'dashboard.sprint_progress': 'full',
    'dashboard.assigned_tasks': 'full', 'dashboard.bug_queue': 'read_only', 'dashboard.project_overview': 'full',
    'dashboard.system_health': 'none', 'dashboard.ai_insights': 'full', 'dashboard.workload': 'full',
    'dashboard.capacity': 'full', 'dashboard.org_overview': 'none', 'dashboard.security_alerts': 'none',
    'dashboard.sla_metrics': 'none',
    'issues.create': 'full', 'issues.edit': 'full', 'issues.delete': 'limited', 'issues.assign': 'full',
    'issues.change_status': 'full', 'issues.view': 'full', 'issues.comment': 'full', 'issues.manage_labels': 'full',
    'issues.edit_own': 'full', 'issues.view_own': 'full', 'issues.transition_qa': 'none',
    'board.view': 'full', 'board.drag_drop': 'full',
    'backlog.view': 'full', 'backlog.manage': 'full',
    'timeline.view': 'full', 'calendar.view': 'full',
    'dependencies.view': 'full',
    'reports.view': 'full', 'reports.manage': 'limited',
    'sprint.create': 'full', 'sprint.manage': 'full', 'sprint.view': 'full',
    'ai.use': 'full',
    'team.view': 'full', 'team.manage': 'limited', 'team.invite': 'full',
    'integrations.view': 'full', 'integrations.manage': 'none',
    'settings.view': 'full', 'settings.manage': 'limited',
    'enterprise.manage': 'none', 'whitelabel.manage': 'none',
    'audit.view': 'none', 'billing.view': 'none', 'billing.manage': 'none', 'security.manage': 'none',
    'pull_requests.view': 'full', 'pull_requests.manage': 'none', 'time_tracking.view': 'full', 'time_tracking.manage': 'none',
    'qa.verify': 'none', 'qa.reopen': 'none', 'qa.testing_queue': 'read_only', 'qa.sla_tracking': 'none',
    'inbox.view': 'full',
    'workflow.manage': 'none', 'custom_fields.manage': 'none', 'automation.manage': 'none',
    'releases.manage': 'none', 'labels.manage': 'limited', 'components.manage': 'none',
    'capacity.manage': 'full', 'capacity.view': 'full',
    'comments.create': 'full', 'watching.manage': 'full',
  },
  developer: {
    'dashboard.view': 'full', 'dashboard.admin_analytics': 'none', 'dashboard.sprint_progress': 'read_only',
    'dashboard.assigned_tasks': 'full', 'dashboard.bug_queue': 'none', 'dashboard.project_overview': 'none',
    'dashboard.system_health': 'none', 'dashboard.ai_insights': 'none', 'dashboard.workload': 'none',
    'dashboard.capacity': 'none', 'dashboard.org_overview': 'none', 'dashboard.security_alerts': 'none',
    'dashboard.sla_metrics': 'none',
    'issues.create': 'full', 'issues.edit': 'own_only', 'issues.delete': 'own_only', 'issues.assign': 'none',
    'issues.change_status': 'own_only', 'issues.view': 'full', 'issues.comment': 'full', 'issues.manage_labels': 'limited',
    'issues.edit_own': 'full', 'issues.view_own': 'full', 'issues.transition_qa': 'none',
    'board.view': 'full', 'board.drag_drop': 'own_only',
    'backlog.view': 'full', 'backlog.manage': 'none',
    'timeline.view': 'full', 'calendar.view': 'full',
    'dependencies.view': 'read_only',
    'reports.view': 'read_only', 'reports.manage': 'none',
    'sprint.create': 'none', 'sprint.manage': 'none', 'sprint.view': 'full',
    'ai.use': 'full',
    'team.view': 'read_only', 'team.manage': 'none', 'team.invite': 'none',
    'integrations.view': 'read_only', 'integrations.manage': 'none',
    'settings.view': 'limited', 'settings.manage': 'none',
    'enterprise.manage': 'none', 'whitelabel.manage': 'none',
    'audit.view': 'none', 'billing.view': 'none', 'billing.manage': 'none', 'security.manage': 'none',
    'pull_requests.view': 'full', 'pull_requests.manage': 'full', 'time_tracking.view': 'full', 'time_tracking.manage': 'full',
    'qa.verify': 'none', 'qa.reopen': 'none', 'qa.testing_queue': 'none', 'qa.sla_tracking': 'none',
    'inbox.view': 'full',
    'workflow.manage': 'none', 'custom_fields.manage': 'none', 'automation.manage': 'none',
    'releases.manage': 'none', 'labels.manage': 'none', 'components.manage': 'none',
    'capacity.manage': 'none', 'capacity.view': 'none',
    'comments.create': 'full', 'watching.manage': 'full',
  },
  qa: {
    'dashboard.view': 'full', 'dashboard.admin_analytics': 'none', 'dashboard.sprint_progress': 'read_only',
    'dashboard.assigned_tasks': 'own_only', 'dashboard.bug_queue': 'full', 'dashboard.project_overview': 'none',
    'dashboard.system_health': 'none', 'dashboard.ai_insights': 'none', 'dashboard.workload': 'none',
    'dashboard.capacity': 'none', 'dashboard.org_overview': 'none', 'dashboard.security_alerts': 'none',
    'dashboard.sla_metrics': 'full',
    'issues.create': 'full', 'issues.edit': 'limited', 'issues.delete': 'own_only', 'issues.assign': 'none',
    'issues.change_status': 'limited', 'issues.view': 'full', 'issues.comment': 'full', 'issues.manage_labels': 'full',
    'issues.edit_own': 'full', 'issues.view_own': 'full', 'issues.transition_qa': 'full',
    'board.view': 'full', 'board.drag_drop': 'limited',
    'backlog.view': 'full', 'backlog.manage': 'none',
    'timeline.view': 'read_only', 'calendar.view': 'read_only',
    'dependencies.view': 'read_only',
    'reports.view': 'full', 'reports.manage': 'limited',
    'sprint.create': 'none', 'sprint.manage': 'none', 'sprint.view': 'full',
    'ai.use': 'full',
    'team.view': 'read_only', 'team.manage': 'none', 'team.invite': 'none',
    'integrations.view': 'read_only', 'integrations.manage': 'none',
    'settings.view': 'limited', 'settings.manage': 'none',
    'enterprise.manage': 'none', 'whitelabel.manage': 'none',
    'audit.view': 'none', 'billing.view': 'none', 'billing.manage': 'none', 'security.manage': 'none',
    'pull_requests.view': 'read_only', 'pull_requests.manage': 'none', 'time_tracking.view': 'full', 'time_tracking.manage': 'full',
    'qa.verify': 'full', 'qa.reopen': 'full', 'qa.testing_queue': 'full', 'qa.sla_tracking': 'full',
    'inbox.view': 'full',
    'workflow.manage': 'none', 'custom_fields.manage': 'none', 'automation.manage': 'none',
    'releases.manage': 'none', 'labels.manage': 'none', 'components.manage': 'none',
    'capacity.manage': 'none', 'capacity.view': 'none',
    'comments.create': 'full', 'watching.manage': 'full',
  },
  viewer: {
    'dashboard.view': 'full', 'dashboard.admin_analytics': 'none', 'dashboard.sprint_progress': 'read_only',
    'dashboard.assigned_tasks': 'none', 'dashboard.bug_queue': 'none', 'dashboard.project_overview': 'full',
    'dashboard.system_health': 'none', 'dashboard.ai_insights': 'none', 'dashboard.workload': 'none',
    'dashboard.capacity': 'none', 'dashboard.org_overview': 'none', 'dashboard.security_alerts': 'none',
    'dashboard.sla_metrics': 'none',
    'issues.create': 'none', 'issues.edit': 'none', 'issues.delete': 'none', 'issues.assign': 'none',
    'issues.change_status': 'none', 'issues.view': 'read_only', 'issues.comment': 'full', 'issues.manage_labels': 'none',
    'issues.edit_own': 'none', 'issues.view_own': 'none', 'issues.transition_qa': 'none',
    'board.view': 'read_only', 'board.drag_drop': 'none',
    'backlog.view': 'read_only', 'backlog.manage': 'none',
    'timeline.view': 'read_only', 'calendar.view': 'read_only',
    'dependencies.view': 'read_only',
    'reports.view': 'read_only', 'reports.manage': 'none',
    'sprint.create': 'none', 'sprint.manage': 'none', 'sprint.view': 'read_only',
    'ai.use': 'none',
    'team.view': 'read_only', 'team.manage': 'none', 'team.invite': 'none',
    'integrations.view': 'read_only', 'integrations.manage': 'none',
    'settings.view': 'none', 'settings.manage': 'none',
    'enterprise.manage': 'none', 'whitelabel.manage': 'none',
    'audit.view': 'none', 'billing.view': 'none', 'billing.manage': 'none', 'security.manage': 'none',
    'pull_requests.view': 'none', 'pull_requests.manage': 'none', 'time_tracking.view': 'none', 'time_tracking.manage': 'none',
    'qa.verify': 'none', 'qa.reopen': 'none', 'qa.testing_queue': 'none', 'qa.sla_tracking': 'none',
    'inbox.view': 'full',
    'workflow.manage': 'none', 'custom_fields.manage': 'none', 'automation.manage': 'none',
    'releases.manage': 'none', 'labels.manage': 'none', 'components.manage': 'none',
    'capacity.manage': 'none', 'capacity.view': 'none',
    'comments.create': 'full', 'watching.manage': 'full',
  },
};

// --- Permission Engine ---

export function getAccessLevel(role: PlanXRole, permission: Permission): AccessLevel {
  return PERMISSION_MATRIX[role]?.[permission] ?? 'none';
}

export function hasPermission(role: PlanXRole, permission: Permission): boolean {
  return getAccessLevel(role, permission) !== 'none';
}

export function canView(role: PlanXRole, permission: Permission): boolean {
  const level = getAccessLevel(role, permission);
  return level !== 'none';
}

export function canEdit(role: PlanXRole, permission: Permission): boolean {
  const level = getAccessLevel(role, permission);
  return level === 'full' || level === 'limited' || level === 'own_only';
}

export function canDelete(role: PlanXRole, permission: Permission): boolean {
  const level = getAccessLevel(role, permission);
  return level === 'full' || level === 'limited';
}

export function canAssign(role: PlanXRole, permission: Permission): boolean {
  const level = getAccessLevel(role, permission);
  return level === 'full';
}

export function canConfigure(role: PlanXRole, permission: Permission): boolean {
  const level = getAccessLevel(role, permission);
  return level === 'full';
}

export function canTransition(role: PlanXRole, permission: Permission): boolean {
  const level = getAccessLevel(role, permission);
  return level === 'full' || level === 'limited' || level === 'own_only';
}

export function isReadOnly(role: PlanXRole, permission: Permission): boolean {
  return getAccessLevel(role, permission) === 'read_only';
}

export function isOwnOnly(role: PlanXRole, permission: Permission): boolean {
  return getAccessLevel(role, permission) === 'own_only';
}

export function isLimited(role: PlanXRole, permission: Permission): boolean {
  return getAccessLevel(role, permission) === 'limited';
}

export function hasAnyPermission(role: PlanXRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getPermissions(role: PlanXRole): Permission[] {
  const matrix = PERMISSION_MATRIX[role] ?? {};
  return Object.entries(matrix).filter(([, v]) => v !== 'none').map(([k]) => k as Permission);
}

// --- Role Metadata ---

export interface SidebarItem {
  href: string;
  label: string;
  icon: string;
  badge?: boolean;
  projectKey?: string;
}

export interface SidebarSection {
  title: string;
  defaultOpen: boolean;
  items: SidebarItem[];
}

export interface QuickAction {
  label: string;
  icon: string;
  href: string;
  permission: Permission;
  color: string;
}

export interface RoleMeta {
  id: PlanXRole;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  greeting: string;
  subtitle: string;
  sidebarSections: SidebarSection[];
  quickActions: QuickAction[];
  emptyStateMessage: string;
  dashboardTitle: string;
}

export const ROLE_META: Record<PlanXRole, RoleMeta> = {
  super_admin: {
    id: 'super_admin',
    label: 'Super Admin',
    description: 'Full unrestricted access. Organization-wide control, security, billing, and global settings.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    icon: 'ShieldCheck',
    greeting: 'Command center',
    subtitle: 'Organization-wide operations',
    dashboardTitle: 'Organization Overview',
    emptyStateMessage: 'No data yet. Configure your organization to get started.',
    sidebarSections: [
      {
        title: 'Organization',
        defaultOpen: true,
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
          { href: '/inbox', label: 'Inbox', icon: 'Bell', badge: true },
        ],
      },
      {
        title: 'Operations',
        defaultOpen: true,
        items: [
          { href: '/settings/team', label: 'Members & Roles', icon: 'Users' },
          { href: '/settings/enterprise', label: 'Security Center', icon: 'Shield' },
          { href: '/settings/integrations', label: 'Integrations', icon: 'Plug' },
          { href: '/settings/white-label', label: 'White Label', icon: 'Boxes' },
          { href: '/settings/enterprise', label: 'Audit Logs', icon: 'ScrollText' },
        ],
      },
      {
        title: 'AI',
        defaultOpen: false,
        items: [
          { href: '/ai/sprint-planner', label: 'AI Insights', icon: 'Zap' },
          { href: '/ai/task-generator', label: 'Task Generator', icon: 'Sparkles' },
          { href: '/ai/roadmap', label: 'Roadmap AI', icon: 'GitBranch' },
        ],
      },
    ],
    quickActions: [
      { label: 'Add Member', icon: 'UserPlus', href: '/settings/team', permission: 'team.invite', color: 'text-blue-500' },
      { label: 'Security Config', icon: 'Shield', href: '/settings/enterprise', permission: 'security.manage', color: 'text-red-500' },
      { label: 'Integration', icon: 'Plug', href: '/settings/integrations', permission: 'integrations.manage', color: 'text-green-500' },
    ],
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Project configuration, workflow design, automation, custom fields, and release management.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    icon: 'Settings2',
    greeting: 'Configuration hub',
    subtitle: 'Projects, workflows, and automation',
    dashboardTitle: 'Admin Workspace',
    emptyStateMessage: 'Configure your project workflows and automations.',
    sidebarSections: [
      {
        title: 'Projects',
        defaultOpen: true,
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
          { href: '/inbox', label: 'Inbox', icon: 'Bell', badge: true },
          { href: '/admin/workflow', label: 'Workflow Builder', icon: 'GitMerge' },
          { href: '/admin/custom-fields', label: 'Custom Fields', icon: 'SlidersHorizontal' },
          { href: '/admin/automation', label: 'Automation', icon: 'Zap' },
        ],
      },
      {
        title: 'Configuration',
        defaultOpen: true,
        items: [
          { href: '/admin/labels', label: 'Labels', icon: 'Tag' },
          { href: '/admin/components', label: 'Components', icon: 'Puzzle' },
          { href: '/admin/releases', label: 'Releases', icon: 'Package' },
          { href: '/settings/integrations', label: 'Integrations', icon: 'Plug' },
          { href: '/settings/team', label: 'Members', icon: 'Users' },
        ],
      },
      {
        title: 'AI',
        defaultOpen: false,
        items: [
          { href: '/ai/sprint-planner', label: 'Sprint Planner', icon: 'Zap' },
          { href: '/ai/task-generator', label: 'Task Generator', icon: 'Sparkles' },
          { href: '/ai/roadmap', label: 'Roadmap AI', icon: 'GitBranch' },
        ],
      },
    ],
    quickActions: [
      { label: 'New Workflow', icon: 'GitMerge', href: '/admin/workflow', permission: 'workflow.manage', color: 'text-cyan-500' },
      { label: 'Add Field', icon: 'SlidersHorizontal', href: '/admin/custom-fields', permission: 'custom_fields.manage', color: 'text-blue-500' },
      { label: 'New Release', icon: 'Package', href: '/admin/releases', permission: 'releases.manage', color: 'text-green-500' },
    ],
  },
  manager: {
    id: 'manager',
    label: 'Manager',
    description: 'Sprint planning, team workload balancing, delivery metrics, and strategic roadmaps.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: 'FolderKanban',
    greeting: 'Sprint overview',
    subtitle: 'Planning, analytics, and delivery',
    dashboardTitle: 'Manager Workspace',
    emptyStateMessage: 'No active sprints. Create a sprint to start planning.',
    sidebarSections: [
      {
        title: 'Planning',
        defaultOpen: true,
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
          { href: '/inbox', label: 'Inbox', icon: 'Bell', badge: true },
          { href: '/my-issues', label: 'My Issues', icon: 'List' },
        ],
      },
      {
        title: 'Sprint',
        defaultOpen: true,
        items: [
          { href: '/board', label: 'Sprint Board', icon: 'Kanban', projectKey: 'px' },
          { href: '/backlog', label: 'Backlog', icon: 'List', projectKey: 'px' },
          { href: '/manager/capacity', label: 'Capacity', icon: 'Gauge' },
          { href: '/timeline', label: 'Timeline', icon: 'Activity', projectKey: 'px' },
          { href: '/calendar', label: 'Calendar', icon: 'Calendar', projectKey: 'px' },
        ],
      },
      {
        title: 'Analytics',
        defaultOpen: false,
        items: [
          { href: '/reports', label: 'Reports', icon: 'BarChart3', projectKey: 'px' },
          { href: '/dependencies', label: 'Dependencies', icon: 'Network', projectKey: 'px' },
        ],
      },
      {
        title: 'AI',
        defaultOpen: false,
        items: [
          { href: '/ai/sprint-planner', label: 'Sprint Planner', icon: 'Zap' },
          { href: '/ai/roadmap', label: 'Roadmap AI', icon: 'GitBranch' },
          { href: '/ai/task-generator', label: 'Task Generator', icon: 'Sparkles' },
        ],
      },
      {
        title: 'Workspace',
        defaultOpen: false,
        items: [
          { href: '/settings/team', label: 'Members', icon: 'Users' },
          { href: '/settings/integrations', label: 'Integrations', icon: 'Plug' },
        ],
      },
    ],
    quickActions: [
      { label: 'Plan Sprint', icon: 'Zap', href: '/ai/sprint-planner', permission: 'sprint.create', color: 'text-blue-500' },
      { label: 'Capacity', icon: 'Gauge', href: '/manager/capacity', permission: 'capacity.manage', color: 'text-green-500' },
      { label: 'Assign Issues', icon: 'UserPlus', href: '/backlog', permission: 'issues.assign', color: 'text-orange-500' },
    ],
  },
  developer: {
    id: 'developer',
    label: 'Developer',
    description: 'Focused execution workspace. Assigned tasks, PRs, time tracking, and keyboard-first workflow.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    icon: 'Code2',
    greeting: 'Your tasks',
    subtitle: 'Execute, ship, and track',
    dashboardTitle: 'Developer Workspace',
    emptyStateMessage: 'No tasks assigned. Check the backlog for available work.',
    sidebarSections: [
      {
        title: 'My Work',
        defaultOpen: true,
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
          { href: '/my-issues', label: 'My Tasks', icon: 'List' },
          { href: '/dev/pull-requests', label: 'Pull Requests', icon: 'GitPullRequest' },
          { href: '/dev/time-tracking', label: 'Time Logs', icon: 'Timer' },
          { href: '/inbox', label: 'Notifications', icon: 'Bell', badge: true },
        ],
      },
      {
        title: 'Sprint',
        defaultOpen: true,
        items: [
          { href: '/board', label: 'Sprint Board', icon: 'Kanban', projectKey: 'px' },
          { href: '/backlog', label: 'Backlog', icon: 'List', projectKey: 'px' },
        ],
      },
      {
        title: 'AI',
        defaultOpen: false,
        items: [
          { href: '/ai/task-generator', label: 'Task Generator', icon: 'Sparkles' },
          { href: '/ai/sprint-planner', label: 'Sprint Planner', icon: 'Zap' },
        ],
      },
    ],
    quickActions: [
      { label: 'New Issue', icon: 'Plus', href: '/my-issues', permission: 'issues.create', color: 'text-green-500' },
      { label: 'Log Time', icon: 'Timer', href: '/dev/time-tracking', permission: 'time_tracking.manage', color: 'text-orange-500' },
      { label: 'PRs', icon: 'GitPullRequest', href: '/dev/pull-requests', permission: 'pull_requests.view', color: 'text-blue-500' },
    ],
  },
  qa: {
    id: 'qa',
    label: 'QA / Tester',
    description: 'Dedicated quality workflow. Bug tracking, verification gates, SLA tracking, and test result logging.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    icon: 'Bug',
    greeting: 'Quality gate',
    subtitle: 'Verify, validate, and track',
    dashboardTitle: 'QA Workspace',
    emptyStateMessage: 'No bugs in the queue. Time to celebrate or write more tests!',
    sidebarSections: [
      {
        title: 'QA Work',
        defaultOpen: true,
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
          { href: '/qa/testing-queue', label: 'Testing Queue', icon: 'TestTube' },
          { href: '/qa/verification', label: 'Verification', icon: 'CheckSquare' },
          { href: '/qa/sla', label: 'SLA Tracking', icon: 'Clock' },
          { href: '/inbox', label: 'Notifications', icon: 'Bell', badge: true },
        ],
      },
      {
        title: 'Bug Board',
        defaultOpen: true,
        items: [
          { href: '/board', label: 'Bug Board', icon: 'Kanban', projectKey: 'px' },
          { href: '/backlog', label: 'Backlog', icon: 'List', projectKey: 'px' },
          { href: '/reports', label: 'QA Reports', icon: 'BarChart3', projectKey: 'px' },
        ],
      },
      {
        title: 'AI',
        defaultOpen: false,
        items: [
          { href: '/ai/task-generator', label: 'Task Generator', icon: 'Sparkles' },
        ],
      },
    ],
    quickActions: [
      { label: 'Report Bug', icon: 'Bug', href: '/my-issues', permission: 'issues.create', color: 'text-red-500' },
      { label: 'Verify', icon: 'CheckSquare', href: '/qa/verification', permission: 'qa.verify', color: 'text-green-500' },
      { label: 'Reopen', icon: 'RotateCcw', href: '/qa/testing-queue', permission: 'qa.reopen', color: 'text-orange-500' },
    ],
  },
  viewer: {
    id: 'viewer',
    label: 'Viewer / Client',
    description: 'Read-only stakeholder access. Executive dashboards, progress summaries, and issue watching.',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    icon: 'Eye',
    greeting: 'Project overview',
    subtitle: 'Observe, comment, and track',
    dashboardTitle: 'Project Overview',
    emptyStateMessage: 'No project data available yet.',
    sidebarSections: [
      {
        title: 'Overview',
        defaultOpen: true,
        items: [
          { href: '/dashboard', label: 'Overview', icon: 'LayoutDashboard' },
          { href: '/inbox', label: 'Inbox', icon: 'Bell', badge: true },
        ],
      },
      {
        title: 'Project',
        defaultOpen: true,
        items: [
          { href: '/board', label: 'Roadmap', icon: 'Kanban', projectKey: 'px' },
          { href: '/timeline', label: 'Timeline', icon: 'Activity', projectKey: 'px' },
          { href: '/reports', label: 'Reports', icon: 'BarChart3', projectKey: 'px' },
        ],
      },
    ],
    quickActions: [
      { label: 'Watch Issue', icon: 'Eye', href: '/board', permission: 'watching.manage', color: 'text-slate-400' },
      { label: 'Comment', icon: 'MessageSquare', href: '/board', permission: 'comments.create', color: 'text-blue-400' },
    ],
  },
};

export const ALL_ROLES: PlanXRole[] = ['super_admin', 'admin', 'manager', 'developer', 'qa', 'viewer'];

// --- Effective Role with Project Overrides ---

export function getEffectiveRole(user: { role: PlanXRole; projectOverrides?: Record<string, PlanXRole> }, projectId?: string): PlanXRole {
  if (projectId && user.projectOverrides?.[projectId]) {
    return user.projectOverrides[projectId];
  }
  return user.role;
}

// --- Status Transition Rules ---

export type StatusTransition = {
  from: IssueStatus;
  to: IssueStatus[];
  allowedRoles: PlanXRole[];
};

type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'testing' | 'done' | 'cancelled';

export const STATUS_TRANSITIONS: StatusTransition[] = [
  { from: 'backlog', to: ['todo', 'cancelled'], allowedRoles: ['super_admin', 'admin', 'manager'] },
  { from: 'todo', to: ['in_progress', 'backlog', 'cancelled'], allowedRoles: ['super_admin', 'admin', 'manager', 'developer'] },
  { from: 'in_progress', to: ['in_review', 'todo', 'cancelled'], allowedRoles: ['super_admin', 'admin', 'manager', 'developer'] },
  { from: 'in_review', to: ['testing', 'in_progress', 'done'], allowedRoles: ['super_admin', 'admin', 'manager', 'qa'] },
  { from: 'testing', to: ['done', 'in_progress', 'cancelled'], allowedRoles: ['super_admin', 'admin', 'qa'] },
  { from: 'done', to: ['in_progress'], allowedRoles: ['super_admin', 'admin', 'qa'] },
  { from: 'cancelled', to: ['backlog'], allowedRoles: ['super_admin', 'admin'] },
];

export function canTransitionTo(role: PlanXRole, fromStatus: string, toStatus: string): boolean {
  const rule = STATUS_TRANSITIONS.find((t) => t.from === fromStatus);
  if (!rule) return false;
  return rule.to.includes(toStatus as any) && rule.allowedRoles.includes(role);
}

export function getAllowedTransitions(role: PlanXRole, currentStatus: string): string[] {
  const rule = STATUS_TRANSITIONS.find((t) => t.from === currentStatus);
  if (!rule) return [];
  if (rule.allowedRoles.includes(role)) return rule.to;
  return [];
}

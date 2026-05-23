import { Issue, Project, Sprint, User, Notification, Integration, AuditLog } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alex Chen', email: 'alex@planx.io', avatar: 'AC', role: 'super_admin' },
  { id: 'u2', name: 'Jordan Lee', email: 'jordan@planx.io', avatar: 'JL', role: 'admin' },
  { id: 'u3', name: 'Sam Rivera', email: 'sam@planx.io', avatar: 'SR', role: 'manager' },
  { id: 'u4', name: 'Morgan Kim', email: 'morgan@planx.io', avatar: 'MK', role: 'developer' },
  { id: 'u5', name: 'Casey Patel', email: 'casey@planx.io', avatar: 'CP', role: 'qa' },
  { id: 'u6', name: 'Taylor Wong', email: 'taylor@planx.io', avatar: 'TW', role: 'viewer' },
];

export const mockIssues: Issue[] = [
  {
    id: 'i1', key: 'PX-001', title: 'Implement OAuth2 SSO for enterprise accounts',
    description: 'Add support for SAML 2.0 and OIDC protocols for enterprise SSO integration.',
    status: 'in_progress', priority: 'urgent', type: 'feature',
    assignee: mockUsers[0], reporter: mockUsers[1],
    storyPoints: 8, dueDate: '2026-05-30',
    createdAt: '2026-05-01T10:00:00Z', updatedAt: '2026-05-20T15:30:00Z',
    projectId: 'p1', sprintId: 's1', labels: [{ id: 'l1', name: 'auth', color: '#3b82f6' }],
    dependencies: ['i5'],
  },
  {
    id: 'i2', key: 'PX-002', title: 'Dashboard performance optimization',
    description: 'Reduce initial dashboard load time by 60% using virtualization and lazy loading.',
    status: 'in_review', priority: 'high', type: 'improvement',
    assignee: mockUsers[1], reporter: mockUsers[0],
    storyPoints: 5, dueDate: '2026-05-28',
    createdAt: '2026-05-03T09:00:00Z', updatedAt: '2026-05-21T11:00:00Z',
    projectId: 'p1', sprintId: 's1', labels: [{ id: 'l2', name: 'performance', color: '#f59e0b' }],
  },
  {
    id: 'i3', key: 'PX-003', title: 'Fix race condition in notification service',
    description: 'Notifications sometimes duplicate when multiple users update the same issue.',
    status: 'todo', priority: 'high', type: 'bug',
    assignee: mockUsers[2], reporter: mockUsers[3],
    storyPoints: 3,
    createdAt: '2026-05-05T14:00:00Z', updatedAt: '2026-05-19T09:00:00Z',
    projectId: 'p1', sprintId: 's1', labels: [{ id: 'l3', name: 'bug', color: '#ef4444' }],
  },
  {
    id: 'i4', key: 'PX-004', title: 'AI-powered sprint planning assistant',
    description: 'Integrate LLM to suggest optimal sprint composition based on team velocity.',
    status: 'in_progress', priority: 'medium', type: 'feature',
    assignee: mockUsers[0], reporter: mockUsers[1],
    storyPoints: 13, dueDate: '2026-06-10',
    createdAt: '2026-05-08T11:00:00Z', updatedAt: '2026-05-22T08:00:00Z',
    projectId: 'p1', sprintId: 's1', labels: [{ id: 'l4', name: 'ai', color: '#8b5cf6' }],
  },
  {
    id: 'i5', key: 'PX-005', title: 'Audit log infrastructure setup',
    description: 'Set up immutable audit log pipeline for compliance requirements.',
    status: 'done', priority: 'high', type: 'task',
    assignee: mockUsers[3], reporter: mockUsers[0],
    storyPoints: 5,
    createdAt: '2026-04-28T10:00:00Z', updatedAt: '2026-05-15T16:00:00Z',
    projectId: 'p1', sprintId: 's1',
  },
  {
    id: 'i6', key: 'PX-006', title: 'Implement dependency graph visualization',
    description: 'Interactive graph view showing issue dependencies and blockers.',
    status: 'backlog', priority: 'medium', type: 'feature',
    assignee: mockUsers[1],
    storyPoints: 8,
    createdAt: '2026-05-10T09:00:00Z', updatedAt: '2026-05-10T09:00:00Z',
    projectId: 'p1', labels: [{ id: 'l5', name: 'visualization', color: '#10b981' }],
    dependencies: ['i1'],
    blocked: true,
  },
  {
    id: 'i7', key: 'PX-007', title: 'Mobile app push notifications',
    description: 'Implement FCM push notifications for iOS and Android.',
    status: 'todo', priority: 'low', type: 'feature',
    storyPoints: 5,
    createdAt: '2026-05-12T10:00:00Z', updatedAt: '2026-05-12T10:00:00Z',
    projectId: 'p1',
  },
  {
    id: 'i8', key: 'PX-008', title: 'Integration hub: GitHub sync',
    description: 'Two-way sync between PlanX issues and GitHub Issues/PRs.',
    status: 'in_progress', priority: 'high', type: 'feature',
    assignee: mockUsers[2],
    storyPoints: 8, dueDate: '2026-06-01',
    createdAt: '2026-05-14T11:00:00Z', updatedAt: '2026-05-21T14:00:00Z',
    projectId: 'p2', sprintId: 's2',
  },
  {
    id: 'i9', key: 'PX-009', title: 'White label configuration panel',
    description: 'Allow enterprise customers to customize branding, colors, and logos.',
    status: 'todo', priority: 'medium', type: 'feature',
    storyPoints: 5,
    createdAt: '2026-05-16T09:00:00Z', updatedAt: '2026-05-16T09:00:00Z',
    projectId: 'p2',
  },
  {
    id: 'i10', key: 'PX-010', title: 'Data retention policy enforcement',
    description: 'Automated data purging based on configurable retention policies.',
    status: 'backlog', priority: 'medium', type: 'task',
    storyPoints: 3,
    createdAt: '2026-05-18T10:00:00Z', updatedAt: '2026-05-18T10:00:00Z',
    projectId: 'p2',
  },
];

export const mockSprints: Sprint[] = [
  {
    id: 's1', name: 'Sprint 23', goal: 'Complete enterprise auth and performance improvements',
    startDate: '2026-05-19', endDate: '2026-06-02',
    status: 'active', projectId: 'p1',
    issues: mockIssues.filter(i => i.sprintId === 's1'),
  },
  {
    id: 's2', name: 'Sprint 24', goal: 'Integration hub and mobile notifications',
    startDate: '2026-06-02', endDate: '2026-06-16',
    status: 'planning', projectId: 'p1',
  },
  {
    id: 's3', name: 'Sprint 22', goal: 'Core platform stability',
    startDate: '2026-05-05', endDate: '2026-05-19',
    status: 'completed', projectId: 'p1',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1', key: 'PX', name: 'PlanX Core',
    description: 'Main product development',
    color: '#3b82f6', icon: 'Layers',
    ownerId: 'u1',
    members: mockUsers,
    issues: mockIssues.filter(i => i.projectId === 'p1'),
    sprints: mockSprints,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'p2', key: 'INT', name: 'Integrations',
    description: 'Third-party integrations and API',
    color: '#10b981', icon: 'Plug',
    ownerId: 'u1',
    members: [mockUsers[0], mockUsers[2], mockUsers[3]],
    issues: mockIssues.filter(i => i.projectId === 'p2'),
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'p3', key: 'MOB', name: 'Mobile',
    description: 'iOS and Android applications',
    color: '#f59e0b', icon: 'Smartphone',
    ownerId: 'u2',
    members: [mockUsers[1], mockUsers[4]],
    createdAt: '2026-03-10T10:00:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1', title: 'Mentioned in PX-004',
    message: 'Jordan Lee mentioned you in a comment on "AI-powered sprint planning assistant"',
    type: 'mention', read: false,
    createdAt: '2026-05-22T09:15:00Z', issueKey: 'PX-004',
  },
  {
    id: 'n2', title: 'PX-002 status changed',
    message: 'Dashboard performance optimization moved to In Review',
    type: 'status_change', read: false,
    createdAt: '2026-05-22T08:30:00Z', issueKey: 'PX-002',
  },
  {
    id: 'n3', title: 'Assigned to PX-008',
    message: 'You were assigned to Integration hub: GitHub sync',
    type: 'assignment', read: true,
    createdAt: '2026-05-21T16:00:00Z', issueKey: 'PX-008',
  },
  {
    id: 'n4', title: 'Comment on PX-001',
    message: 'Sam Rivera commented: "LGTM, ready for security review"',
    type: 'comment', read: true,
    createdAt: '2026-05-21T14:20:00Z', issueKey: 'PX-001',
  },
  {
    id: 'n5', title: 'Sprint 23 starting soon',
    message: 'Sprint 23 ends in 11 days. Review progress and update estimates.',
    type: 'system', read: true,
    createdAt: '2026-05-20T10:00:00Z',
  },
];

export const mockIntegrations: Integration[] = [
  {
    id: 'int1', name: 'GitHub', type: 'github',
    status: 'connected', connectedAt: '2026-03-15T10:00:00Z',
    icon: 'Github',
    description: 'Sync issues and pull requests with GitHub repositories',
    syncedAt: '2026-05-22T08:00:00Z',
  },
  {
    id: 'int2', name: 'Slack', type: 'slack',
    status: 'connected', connectedAt: '2026-04-01T10:00:00Z',
    icon: 'MessageSquare',
    description: 'Get notifications and manage issues from Slack',
    syncedAt: '2026-05-22T09:30:00Z',
  },
  {
    id: 'int3', name: 'GitLab', type: 'gitlab',
    status: 'disconnected',
    icon: 'GitBranch',
    description: 'Connect your GitLab projects for seamless workflow',
  },
  {
    id: 'int4', name: 'Discord', type: 'discord',
    status: 'disconnected',
    icon: 'Headphones',
    description: 'Send notifications to Discord channels',
  },
  {
    id: 'int5', name: 'Sentry', type: 'sentry',
    status: 'connected', connectedAt: '2026-04-20T10:00:00Z',
    icon: 'Bug',
    description: 'Automatically create issues from Sentry errors',
    syncedAt: '2026-05-22T07:15:00Z',
  },
  {
    id: 'int6', name: 'Figma', type: 'figma',
    status: 'error',
    icon: 'Figma',
    description: 'Embed Figma designs directly in issues',
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'al1', action: 'issue.status_changed',
    actor: mockUsers[0], target: 'PX-002',
    metadata: { from: 'in_progress', to: 'in_review' },
    ipAddress: '192.168.1.45', userAgent: 'Chrome/124.0',
    createdAt: '2026-05-22T08:30:00Z',
  },
  {
    id: 'al2', action: 'member.role_changed',
    actor: mockUsers[0], target: 'jordan@planx.io',
    metadata: { from: 'viewer', to: 'member' },
    ipAddress: '192.168.1.45', userAgent: 'Chrome/124.0',
    createdAt: '2026-05-21T15:00:00Z',
  },
  {
    id: 'al3', action: 'integration.connected',
    actor: mockUsers[0], target: 'GitHub',
    ipAddress: '10.0.0.12', userAgent: 'Chrome/124.0',
    createdAt: '2026-05-20T11:00:00Z',
  },
  {
    id: 'al4', action: 'settings.sso_configured',
    actor: mockUsers[0], target: 'SSO',
    metadata: { provider: 'okta' },
    ipAddress: '10.0.0.12', userAgent: 'Chrome/124.0',
    createdAt: '2026-05-19T14:30:00Z',
  },
  {
    id: 'al5', action: 'sprint.created',
    actor: mockUsers[1], target: 'Sprint 24',
    ipAddress: '192.168.1.87', userAgent: 'Firefox/126.0',
    createdAt: '2026-05-18T10:00:00Z',
  },
];

export const velocityData = [
  { sprint: 'S18', committed: 32, completed: 28 },
  { sprint: 'S19', committed: 35, completed: 34 },
  { sprint: 'S20', committed: 38, completed: 35 },
  { sprint: 'S21', committed: 40, completed: 38 },
  { sprint: 'S22', committed: 36, completed: 39 },
  { sprint: 'S23', committed: 42, completed: 22 },
];

export const burndownData = [
  { day: 'May 19', remaining: 42, ideal: 42 },
  { day: 'May 20', remaining: 38, ideal: 36 },
  { day: 'May 21', remaining: 34, ideal: 30 },
  { day: 'May 22', remaining: 28, ideal: 24 },
  { day: 'May 23', remaining: 28, ideal: 18 },
  { day: 'May 24', remaining: null, ideal: 12 },
  { day: 'May 25', remaining: null, ideal: 6 },
  { day: 'May 26', remaining: null, ideal: 0 },
];

export const issueDistribution = [
  { name: 'Feature', value: 45, color: '#3b82f6' },
  { name: 'Bug', value: 25, color: '#ef4444' },
  { name: 'Improvement', value: 20, color: '#10b981' },
  { name: 'Task', value: 10, color: '#f59e0b' },
];

export const teamActivityData = [
  { name: 'Alex Chen', resolved: 12, opened: 8, reviewed: 15 },
  { name: 'Jordan Lee', resolved: 9, opened: 11, reviewed: 7 },
  { name: 'Sam Rivera', resolved: 7, opened: 5, reviewed: 12 },
  { name: 'Morgan Kim', resolved: 15, opened: 4, reviewed: 9 },
  { name: 'Taylor Wong', resolved: 3, opened: 6, reviewed: 4 },
];

export const heatmapData = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week,
    day,
    value: Math.random() > 0.3 ? Math.floor(Math.random() * 10) : 0,
  }))
).flat();

export type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'testing' | 'done' | 'cancelled';
export type IssueType = 'feature' | 'bug' | 'improvement' | 'task' | 'epic';

export type PlanXRole = 'super_admin' | 'admin' | 'manager' | 'developer' | 'qa' | 'viewer';

export type AccessLevel = 'full' | 'read_only' | 'limited' | 'own_only' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: PlanXRole;
  projectOverrides?: Record<string, PlanXRole>;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: Priority;
  type: IssueType;
  assignee?: User;
  reporter?: User;
  labels?: Label[];
  storyPoints?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  sprintId?: string;
  dependencies?: string[];
  blocked?: boolean;
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  issues?: Issue[];
  projectId: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  ownerId: string;
  members?: User[];
  issues?: Issue[];
  sprints?: Sprint[];
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'mention' | 'assignment' | 'comment' | 'status_change' | 'system';
  read: boolean;
  createdAt: string;
  issueKey?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'velocity' | 'burndown' | 'issue_distribution' | 'team_activity' | 'cycle_time' | 'heatmap';
  title: string;
  position: { x: number; y: number; w: number; h: number };
}

export interface Integration {
  id: string;
  name: string;
  type: 'github' | 'gitlab' | 'slack' | 'discord' | 'jira' | 'linear' | 'figma' | 'sentry';
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: string;
  icon: string;
  description: string;
  syncedAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: User;
  target: string;
  metadata?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

'use client';

import { create } from 'zustand';
import { Issue, Project, Sprint, Notification, User, PlanXRole } from './types';
import { mockIssues, mockProjects, mockSprints, mockNotifications, mockUsers } from './mock-data';
import { hasPermission, getAccessLevel, Permission, ROLE_META, RoleMeta, getEffectiveRole, isReadOnly, isOwnOnly, canEdit, canTransitionTo } from './permissions';

const roleUserMap: Record<PlanXRole, User> = {
  super_admin: mockUsers[0],
  admin: mockUsers[1],
  manager: mockUsers[2],
  developer: mockUsers[3],
  qa: mockUsers[4],
  viewer: mockUsers[5],
};

interface AppState {
  currentUser: User;
  activeRole: PlanXRole;
  effectiveRole: PlanXRole;
  projects: Project[];
  activeProjectId: string;
  issues: Issue[];
  sprints: Sprint[];
  notifications: Notification[];
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  theme: 'light' | 'dark';

  setActiveRole: (role: PlanXRole) => void;
  setActiveProject: (id: string) => void;
  updateIssueStatus: (issueId: string, status: Issue['status']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  getActiveProject: () => Project | undefined;
  getUnreadNotificationCount: () => number;

  // Permission engine
  can: (permission: Permission) => boolean;
  canView: (permission: Permission) => boolean;
  canEdit: (permission: Permission) => boolean;
  canDelete: (permission: Permission) => boolean;
  canAssign: (permission: Permission) => boolean;
  canConfigure: (permission: Permission) => boolean;
  canTransition: (permission: Permission) => boolean;
  isReadOnly: (permission: Permission) => boolean;
  isOwnOnly: (permission: Permission) => boolean;
  isLimited: (permission: Permission) => boolean;
  getAccessLevel: (permission: Permission) => string;
  canTransitionToStatus: (fromStatus: string, toStatus: string) => boolean;
  getRoleMeta: () => RoleMeta;
  getEffectiveRole: () => PlanXRole;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockUsers[0],
  activeRole: 'super_admin',
  effectiveRole: 'super_admin',
  projects: mockProjects,
  activeProjectId: 'p1',
  issues: mockIssues,
  sprints: mockSprints,
  notifications: mockNotifications,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  theme: 'dark',

  setActiveRole: (role) => {
    const user = roleUserMap[role];
    set({
      activeRole: role,
      currentUser: user,
      effectiveRole: getEffectiveRole(user, get().activeProjectId),
    });
  },

  setActiveProject: (id) => {
    const { currentUser } = get();
    set({
      activeProjectId: id,
      effectiveRole: getEffectiveRole(currentUser, id),
    });
  },

  updateIssueStatus: (issueId, status) =>
    set((state) => ({
      issues: state.issues.map((i) =>
        i.id === issueId ? { ...i, status, updatedAt: new Date().toISOString() } : i
      ),
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  setTheme: (theme) => set({ theme }),

  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find((p) => p.id === activeProjectId);
  },

  getUnreadNotificationCount: () => {
    const { notifications } = get();
    return notifications.filter((n) => !n.read).length;
  },

  // Permission engine
  can: (permission: Permission) => {
    const { effectiveRole } = get();
    return hasPermission(effectiveRole, permission);
  },

  canView: (permission: Permission) => {
    const { effectiveRole } = get();
    const level = getAccessLevel(effectiveRole, permission);
    return level !== 'none';
  },

  canEdit: (permission: Permission) => {
    const { effectiveRole } = get();
    return canEdit(effectiveRole, permission);
  },

  canDelete: (permission: Permission) => {
    const { effectiveRole } = get();
    const level = getAccessLevel(effectiveRole, permission);
    return level === 'full' || level === 'limited';
  },

  canAssign: (permission: Permission) => {
    const { effectiveRole } = get();
    const level = getAccessLevel(effectiveRole, permission);
    return level === 'full';
  },

  canConfigure: (permission: Permission) => {
    const { effectiveRole } = get();
    const level = getAccessLevel(effectiveRole, permission);
    return level === 'full';
  },

  canTransition: (permission: Permission) => {
    const { effectiveRole } = get();
    const level = getAccessLevel(effectiveRole, permission);
    return level === 'full' || level === 'limited' || level === 'own_only';
  },

  isReadOnly: (permission: Permission) => {
    const { effectiveRole } = get();
    return isReadOnly(effectiveRole, permission);
  },

  isOwnOnly: (permission: Permission) => {
    const { effectiveRole } = get();
    return isOwnOnly(effectiveRole, permission);
  },

  isLimited: (permission: Permission) => {
    const { effectiveRole } = get();
    const level = getAccessLevel(effectiveRole, permission);
    return level === 'limited';
  },

  getAccessLevel: (permission: Permission) => {
    const { effectiveRole } = get();
    return getAccessLevel(effectiveRole, permission);
  },

  canTransitionToStatus: (fromStatus: string, toStatus: string) => {
    const { effectiveRole } = get();
    return canTransitionTo(effectiveRole, fromStatus, toStatus);
  },

  getRoleMeta: () => {
    const { effectiveRole } = get();
    return ROLE_META[effectiveRole];
  },

  getEffectiveRole: () => {
    const { effectiveRole } = get();
    return effectiveRole;
  },
}));

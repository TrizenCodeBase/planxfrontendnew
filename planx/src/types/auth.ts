export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'MEMBER'
  | 'VIEWER'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId?: string
  avatar?: string
}

export const ROLE_HOME: Record<UserRole, string> = {
  SYSTEM_ADMIN: '/system-admin',
  ADMIN: '/admin',
  MANAGER: '/manager',
  MEMBER: '/member',
  VIEWER: '/viewer',
}

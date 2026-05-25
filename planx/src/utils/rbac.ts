import type { UserRole } from '@/types/auth'

export function canAccess(
  userRole: UserRole | undefined,
  allowedRoles: UserRole[]
): boolean {
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}

export function canAccessRoute(
  userRole: UserRole | undefined,
  routePrefix: string
): boolean {
  if (!userRole) return false
  const rolePrefixMap: Record<UserRole, string> = {
    SYSTEM_ADMIN: '/system-admin',
    ADMIN: '/admin',
    MANAGER: '/manager',
    MEMBER: '/member',
    VIEWER: '/viewer',
  }
  const userPrefix = rolePrefixMap[userRole]
  return routePrefix.startsWith(userPrefix)
}

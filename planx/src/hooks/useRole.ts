import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { canAccess, canAccessRoute } from '@/utils/rbac'
import type { UserRole } from '@/types/auth'

export function useRole() {
  const { user } = useAuth()
  const role = user?.role

  return useMemo(
    () => ({
      role,
      isSystemAdmin: role === 'SYSTEM_ADMIN',
      isAdmin: role === 'ADMIN',
      isManager: role === 'MANAGER',
      isMember: role === 'MEMBER',
      isViewer: role === 'VIEWER',
      can: (allowedRoles: UserRole[]) => canAccess(role, allowedRoles),
      canRoute: (routePrefix: string) => canAccessRoute(role, routePrefix),
    }),
    [role]
  )
}

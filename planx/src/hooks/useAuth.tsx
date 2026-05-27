import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authService from '@/services/authService'
import { ROLE_HOME, type AuthUser } from '@/types/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthUser | null>
  logout: () => void
  homePath: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser())
  const [isLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    const authenticated = await authService.login(email, password)
    if (authenticated) setUser(authenticated)
    return authenticated
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const homePath = user ? ROLE_HOME[user.role] : '/login'

  const value = useMemo(
    () => ({ user, isLoading, login, logout, homePath }),
    [user, isLoading, login, logout, homePath],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

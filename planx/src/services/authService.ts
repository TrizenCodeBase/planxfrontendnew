import { MOCK_CREDENTIALS } from '@/mock/users'
import type { AuthUser } from '@/types/auth'

const STORAGE_KEY = 'planx_auth_user'

export function login(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase()
  const match = MOCK_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === normalized && c.password === password
  )
  if (!match) return null
  localStorage.setItem(STORAGE_KEY, JSON.stringify(match.user))
  return match.user
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null
}

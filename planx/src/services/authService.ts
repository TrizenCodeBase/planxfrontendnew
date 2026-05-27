import { MOCK_CREDENTIALS } from '@/mock/users'
import type { AuthUser } from '@/types/auth'

const USER_KEY = 'planx_auth_user'
const TOKEN_KEY = 'planx_auth_token'
const API_BASE = import.meta.env.VITE_API_URL || '/api'
const USE_BACKEND_AUTH = import.meta.env.VITE_USE_BACKEND_AUTH !== 'false'

type LoginResponse = {
  token: string
  user: AuthUser
}

async function loginViaApi(email: string, password: string): Promise<AuthUser | null> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) return null
  const data = (await res.json()) as LoginResponse
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data.user
}

function loginViaMocks(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase()
  const match = MOCK_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === normalized && c.password === password,
  )
  if (!match) return null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.setItem(USER_KEY, JSON.stringify(match.user))
  return match.user
}

export async function login(email: string, password: string): Promise<AuthUser | null> {
  if (USE_BACKEND_AUTH) {
    try {
      const fromApi = await loginViaApi(email, password)
      if (fromApi) return fromApi
    } catch {
      // fallback to mock credentials when backend is unavailable
    }
  }
  return loginViaMocks(email, password)
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null
}

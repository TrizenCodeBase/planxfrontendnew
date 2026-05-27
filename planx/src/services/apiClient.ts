const API_BASE = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'planx_auth_token'

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    })
  } catch {
    throw new Error(
      'Cannot reach PlanX backend. Start it with: cd planx-backend && npm run dev (port 4000).',
    )
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      typeof data.error === 'string'
        ? data.error
        : data.error?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data as T
}

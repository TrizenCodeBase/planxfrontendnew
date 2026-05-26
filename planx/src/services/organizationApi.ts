import type { Organization } from '@/types'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
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

export type CreateOrganizationInput = {
  name: string
  slug: string
  plan: Organization['plan']
  adminEmail: string
}

export type UpdateOrganizationInput = {
  name?: string
  slug?: string
  plan?: Organization['plan']
}

export const organizationApi = {
  list: () => request<Organization[]>('/organizations'),

  create: (body: CreateOrganizationInput) =>
    request<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (id: string, body: UpdateOrganizationInput) =>
    request<Organization>(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  suspend: (id: string) =>
    request<Organization>(`/organizations/${id}/suspend`, { method: 'POST' }),

  remove: (id: string) =>
    request<void>(`/organizations/${id}`, { method: 'DELETE' }),

  stats: (id: string) =>
    request<{ users: number; projects: number; tasks: number }>(
      `/organizations/${id}/stats`
    ),
}

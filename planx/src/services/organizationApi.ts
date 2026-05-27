import type { Organization } from '@/types'
import { apiRequest } from './apiClient'

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
  list: () => apiRequest<Organization[]>('/organizations'),

  create: (body: CreateOrganizationInput) =>
    apiRequest<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (id: string, body: UpdateOrganizationInput) =>
    apiRequest<Organization>(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  suspend: (id: string) =>
    apiRequest<Organization>(`/organizations/${id}/suspend`, { method: 'POST' }),

  remove: (id: string) =>
    apiRequest<void>(`/organizations/${id}`, { method: 'DELETE' }),

  stats: (id: string) =>
    apiRequest<{ users: number; projects: number; tasks: number }>(
      `/organizations/${id}/stats`,
    ),

  resendInvite: (id: string) =>
    apiRequest<Organization>(`/organizations/${id}/resend-invite`, { method: 'POST' }),
}

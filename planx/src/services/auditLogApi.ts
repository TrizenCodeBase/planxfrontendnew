import type { AuditLog } from '@/types/platform'
import { apiRequest } from './apiClient'

export const auditLogApi = {
  list: () => apiRequest<AuditLog[]>('/audit-logs'),
}

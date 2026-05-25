import type { UserRole } from './auth'

export interface PlatformUser {
  id: string
  name: string
  email: string
  role: UserRole
  organizationId?: string
  organizationName?: string
  status: 'active' | 'inactive' | 'invited'
  createdAt: string
}

export interface PaymentRecord {
  id: string
  organizationId: string
  organizationName: string
  amount: number
  plan: 'free' | 'pro' | 'enterprise'
  status: 'paid' | 'pending' | 'failed'
  date: string
}

export interface AuditLog {
  id: string
  action: string
  actor: string
  target: string
  timestamp: string
  ip: string
}

export interface PlatformSession {
  id: string
  userId: string
  userName: string
  device: string
  ip: string
  lastActive: string
  current: boolean
}

export interface InviteRecord {
  id: string
  email: string
  type: 'org_admin' | 'user'
  organizationId?: string
  sentAt: string
  status: 'sent' | 'pending'
}

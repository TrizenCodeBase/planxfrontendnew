import type { AuditLog, PlatformSession } from '@/types/platform'

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    action: 'Organization created',
    actor: 'System Administrator',
    target: 'Pixel Studio',
    timestamp: '2025-05-20T09:12:00Z',
    ip: '192.168.1.10',
  },
  {
    id: 'log-2',
    action: 'User role changed',
    actor: 'System Administrator',
    target: 'jordan@trizenventures.com → MANAGER',
    timestamp: '2025-05-19T14:30:00Z',
    ip: '192.168.1.10',
  },
  {
    id: 'log-3',
    action: 'Plan upgraded',
    actor: 'System Administrator',
    target: 'Trizen Ventures → enterprise',
    timestamp: '2025-05-18T11:00:00Z',
    ip: '192.168.1.10',
  },
  {
    id: 'log-4',
    action: 'Organization suspended',
    actor: 'System Administrator',
    target: 'Legacy Corp',
    timestamp: '2025-05-15T16:45:00Z',
    ip: '192.168.1.10',
  },
  {
    id: 'log-5',
    action: 'Session revoked',
    actor: 'System Administrator',
    target: 'Sam Rivera',
    timestamp: '2025-05-14T08:20:00Z',
    ip: '192.168.1.10',
  },
]

export const initialSessions: PlatformSession[] = [
  {
    id: 'sess-1',
    userId: 'u-adm-1',
    userName: 'Company Admin',
    device: 'Chrome on Windows',
    ip: '10.0.0.42',
    lastActive: '2025-05-25T08:00:00Z',
    current: true,
  },
  {
    id: 'sess-2',
    userId: 'u-mgr-1',
    userName: 'Team Manager',
    device: 'Safari on macOS',
    ip: '10.0.0.88',
    lastActive: '2025-05-24T17:30:00Z',
    current: false,
  },
  {
    id: 'sess-3',
    userId: 'u-mem-1',
    userName: 'Alex Employee',
    device: 'Firefox on Linux',
    ip: '10.0.0.15',
    lastActive: '2025-05-23T12:00:00Z',
    current: false,
  },
]

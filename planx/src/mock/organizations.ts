import type { Organization } from '@/types'

export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Trizen Ventures',
    slug: 'trizen-ventures',
    plan: 'pro',
    collaboratorCount: 48,
    projectCount: 12,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'org-2',
    name: 'Nova Labs',
    slug: 'nova-labs',
    plan: 'enterprise',
    collaboratorCount: 120,
    projectCount: 34,
    createdAt: '2023-06-20',
    status: 'active',
  },
  {
    id: 'org-3',
    name: 'Pixel Studio',
    slug: 'pixel-studio',
    plan: 'free',
    collaboratorCount: 8,
    projectCount: 3,
    createdAt: '2025-02-01',
    status: 'active',
  },
  {
    id: 'org-4',
    name: 'Legacy Corp',
    slug: 'legacy-corp',
    plan: 'pro',
    collaboratorCount: 22,
    projectCount: 7,
    createdAt: '2022-11-10',
    status: 'suspended',
  },
]

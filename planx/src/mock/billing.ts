import type { PaymentRecord } from '@/types/platform'

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-1',
    organizationId: 'org-1',
    organizationName: 'Trizen Ventures',
    amount: 299,
    plan: 'pro',
    status: 'paid',
    date: '2025-05-01',
  },
  {
    id: 'pay-2',
    organizationId: 'org-2',
    organizationName: 'Nova Labs',
    amount: 999,
    plan: 'enterprise',
    status: 'paid',
    date: '2025-04-28',
  },
  {
    id: 'pay-3',
    organizationId: 'org-1',
    organizationName: 'Trizen Ventures',
    amount: 299,
    plan: 'pro',
    status: 'paid',
    date: '2025-04-01',
  },
]

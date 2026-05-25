import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import type { Organization } from '@/types'

export function SystemAdminBilling() {
  const { organizations, payments, toast, setToast, changeOrgPlan } = usePlanXStore()
  const [planOrg, setPlanOrg] = useState<Organization | null>(null)
  const [newPlan, setNewPlan] = useState<Organization['plan']>('pro')

  const freeCount = organizations.filter((o) => o.plan === 'free').length
  const paidCount = organizations.filter((o) => o.plan !== 'free').length

  return (
    <div>
      <PageHeader title="Billing" description="Manage plans, upgrades, downgrades, and payment history" />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Free Tier Orgs" value={freeCount} />
        <StatCard label="Paid Tier Orgs" value={paidCount} />
        <StatCard label="Total Revenue (mock)" value={`$${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`} />
      </div>

      <Card title="Organizations — Plan management" className="mb-4">
        <Table>
          <TableHead>
            <TableHeaderCell>Organization</TableHeaderCell>
            <TableHeaderCell>Current plan</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="capitalize">{org.plan}</TableCell>
                <TableCell>
                  <Button variant="secondary" size="sm" onClick={() => { setPlanOrg(org); setNewPlan(org.plan) }}>
                    Change plan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card title="Payment history">
        <Table>
          <TableHead>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Organization</TableHeaderCell>
            <TableHeaderCell>Plan</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableHead>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.date}</TableCell>
                <TableCell>{p.organizationName}</TableCell>
                <TableCell className="capitalize">{p.plan}</TableCell>
                <TableCell>${p.amount}</TableCell>
                <TableCell>
                  <Badge label={p.status} variant={p.status === 'paid' ? 'done' : 'todo'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={!!planOrg} onClose={() => setPlanOrg(null)} title={`Change plan — ${planOrg?.name}`} footer={
        <ModalActions onCancel={() => setPlanOrg(null)} onConfirm={() => { if (planOrg) changeOrgPlan(planOrg.id, newPlan); setPlanOrg(null) }} confirmLabel="Update plan" />
      }>
        <Select label="Plan" value={newPlan} onChange={(e) => setNewPlan(e.target.value as Organization['plan'])} options={[
          { value: 'free', label: 'Free (downgrade)' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise (upgrade)' },
        ]} />
      </Modal>
    </div>
  )
}

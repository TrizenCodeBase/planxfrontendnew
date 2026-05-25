import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import type { Organization } from '@/types'

export function SystemAdminOrganizations() {
  const {
    organizations,
    toast,
    setToast,
    createOrganization,
    updateOrganization,
    suspendOrganization,
    deleteOrganization,
    getOrgStats,
  } = usePlanXStore()

  const [createOpen, setCreateOpen] = useState(false)
  const [editOrg, setEditOrg] = useState<Organization | null>(null)
  const [statsOrg, setStatsOrg] = useState<Organization | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', plan: 'free' as Organization['plan'], adminEmail: '' })

  const openCreate = () => {
    setForm({ name: '', slug: '', plan: 'free', adminEmail: '' })
    setCreateOpen(true)
  }

  const handleCreate = () => {
    if (!form.name || !form.slug || !form.adminEmail) return
    createOrganization(form)
    setCreateOpen(false)
  }

  const handleUpdate = () => {
    if (!editOrg) return
    updateOrganization(editOrg.id, { name: form.name, slug: form.slug, plan: form.plan })
    setEditOrg(null)
  }

  return (
    <div>
      <PageHeader
        title="Organization Management"
        description="Create, update, suspend, or delete tenant organizations"
        actions={<Button onClick={openCreate}>Create organization</Button>}
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <Card>
        <Table>
          <TableHead>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Plan</TableHeaderCell>
            <TableHeaderCell>Collaborators</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="capitalize">{org.plan}</TableCell>
                <TableCell>{org.collaboratorCount}</TableCell>
                <TableCell>
                  <Badge label={org.status} variant={org.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setStatsOrg(org)}>
                      Stats
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditOrg(org)
                        setForm({ name: org.name, slug: org.slug, plan: org.plan, adminEmail: '' })
                      }}
                    >
                      Edit
                    </Button>
                    {org.status === 'active' && (
                      <Button variant="ghost" size="sm" onClick={() => suspendOrganization(org.id)}>
                        Suspend
                      </Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => deleteOrganization(org.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create organization" footer={
        <ModalActions onCancel={() => setCreateOpen(false)} onConfirm={handleCreate} confirmLabel="Create & send invite" />
      }>
        <div className="space-y-3">
          <Input label="Organization name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Select label="Plan" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as Organization['plan'] })} options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' },
          ]} />
          <Input label="Admin email (invite sent automatically)" type="email" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} />
        </div>
      </Modal>

      <Modal open={!!editOrg} onClose={() => setEditOrg(null)} title="Update organization" footer={
        <ModalActions onCancel={() => setEditOrg(null)} onConfirm={handleUpdate} />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Select label="Plan" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as Organization['plan'] })} options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' },
          ]} />
        </div>
      </Modal>

      <Modal open={!!statsOrg} onClose={() => setStatsOrg(null)} title={statsOrg ? `${statsOrg.name} — Stats` : ''}>
        {statsOrg && (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Users</dt><dd className="font-medium">{getOrgStats(statsOrg.id).users}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Projects</dt><dd className="font-medium">{getOrgStats(statsOrg.id).projects}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Tasks</dt><dd className="font-medium">{getOrgStats(statsOrg.id).tasks}</dd></div>
          </dl>
        )}
      </Modal>
    </div>
  )
}

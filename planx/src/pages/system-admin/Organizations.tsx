import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import { organizationApi } from '@/services/organizationApi'
import type { Organization } from '@/types'

const USE_ORG_API = import.meta.env.VITE_USE_ORG_API !== 'false'

export function SystemAdminOrganizations() {
  const {
    organizations,
    organizationsLoading,
    loadOrganizations,
    toast,
    setToast,
    createOrganization,
    updateOrganization,
    suspendOrganization,
    deleteOrganization,
    resendOrganizationInvite,
    getOrgStats,
  } = usePlanXStore()

  const [createOpen, setCreateOpen] = useState(false)
  const [editOrg, setEditOrg] = useState<Organization | null>(null)
  const [statsOrg, setStatsOrg] = useState<Organization | null>(null)
  const [orgStats, setOrgStats] = useState<{ users: number; projects: number; tasks: number } | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState('')
  const [resendingInviteId, setResendingInviteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', plan: 'free' as Organization['plan'], adminEmail: '' })

  useEffect(() => {
    void loadOrganizations()
  }, [loadOrganizations])

  useEffect(() => {
    if (!statsOrg) {
      setOrgStats(null)
      setStatsError('')
      setStatsLoading(false)
      return
    }

    if (!USE_ORG_API) {
      setOrgStats(getOrgStats(statsOrg.id))
      setStatsError('')
      setStatsLoading(false)
      return
    }

    let cancelled = false
    setStatsLoading(true)
    setStatsError('')
    setOrgStats(null)

    organizationApi
      .stats(statsOrg.id)
      .then((stats) => {
        if (!cancelled) setOrgStats(stats)
      })
      .catch((err) => {
        if (!cancelled) {
          setStatsError(err instanceof Error ? err.message : 'Failed to load organization stats.')
        }
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [statsOrg, getOrgStats])

  const openCreate = () => {
    setForm({ name: '', slug: '', plan: 'free', adminEmail: '' })
    setCreateOpen(true)
  }

  const handleCreate = async () => {
    if (!form.name || !form.slug || !form.adminEmail) return
    setSubmitting(true)
    try {
      await createOrganization(form)
      setCreateOpen(false)
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to create organization.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editOrg) return
    setSubmitting(true)
    try {
      await updateOrganization(editOrg.id, { name: form.name, slug: form.slug, plan: form.plan })
      setEditOrg(null)
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to update organization.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSuspend = async (id: string) => {
    try {
      await suspendOrganization(id)
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to suspend organization.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this organization? This cannot be undone.')) return
    try {
      await deleteOrganization(id)
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to delete organization.')
    }
  }

  const handleResendInvite = async (id: string) => {
    setResendingInviteId(id)
    try {
      await resendOrganizationInvite(id)
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to resend invite.')
    } finally {
      setResendingInviteId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Organization Management"
        description="Create, update, suspend, or delete tenant organizations. Invites are sent from support@trizenhr.com (Microsoft 365)."
        actions={<Button onClick={openCreate}>Create organization</Button>}
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <Card>
        {organizationsLoading ? (
          <p className="p-4 text-sm text-[var(--color-text-muted)]">Loading organizations…</p>
        ) : (
          <Table>
            <TableHead>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Plan</TableHeaderCell>
              <TableHeaderCell>Admin</TableHeaderCell>
              <TableHeaderCell>Invite</TableHeaderCell>
              <TableHeaderCell>Collaborators</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHead>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell className="capitalize">{org.plan}</TableCell>
                  <TableCell className="text-sm">{org.adminEmail ?? '—'}</TableCell>
                  <TableCell>
                    {org.inviteStatus ? (
                      <Badge label={org.inviteStatus} variant={org.inviteStatus === 'sent' ? 'active' : 'suspended'} />
                    ) : (
                      '—'
                    )}
                  </TableCell>
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
                          setForm({ name: org.name, slug: org.slug, plan: org.plan, adminEmail: org.adminEmail ?? '' })
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!USE_ORG_API || !org.adminEmail || resendingInviteId === org.id}
                        onClick={() => void handleResendInvite(org.id)}
                      >
                        {resendingInviteId === org.id ? 'Sending…' : 'Resend invite'}
                      </Button>
                      {org.status === 'active' && (
                        <Button variant="ghost" size="sm" onClick={() => void handleSuspend(org.id)}>
                          Suspend
                        </Button>
                      )}
                      <Button variant="danger" size="sm" onClick={() => void handleDelete(org.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create organization" footer={
        <ModalActions
          onCancel={() => setCreateOpen(false)}
          onConfirm={() => void handleCreate()}
          confirmLabel={submitting ? 'Creating…' : 'Create & send invite'}
        />
      }>
        <div className="space-y-3">
          <Input label="Organization name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Select label="Plan" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as Organization['plan'] })} options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' },
          ]} />
          <Input
            label="Admin email (organization invite recipient)"
            type="email"
            value={form.adminEmail}
            onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
            placeholder="support@trizenventures.com"
          />
          <p className="text-xs text-[var(--color-text-muted)]">
            Invite sent from support@trizenhr.com to this address. Copies: system admin at support@trizenhr.com and support@trizenventures.com.
          </p>
        </div>
      </Modal>

      <Modal open={!!editOrg} onClose={() => setEditOrg(null)} title="Update organization" footer={
        <ModalActions
          onCancel={() => setEditOrg(null)}
          onConfirm={() => void handleUpdate()}
          confirmLabel={submitting ? 'Saving…' : 'Save'}
        />
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
          <>
            {statsLoading && (
              <p className="text-sm text-[var(--color-text-muted)]">Loading stats…</p>
            )}
            {statsError && (
              <p className="text-sm text-red-600">{statsError}</p>
            )}
            {orgStats && !statsLoading && (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Users</dt><dd className="font-medium">{orgStats.users}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Projects</dt><dd className="font-medium">{orgStats.projects}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--color-text-muted)]">Tasks</dt><dd className="font-medium">{orgStats.tasks}</dd></div>
              </dl>
            )}
            {USE_ORG_API && orgStats && !statsLoading && orgStats.tasks === 0 && (
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                Task count stays at 0 until tasks are stored in the backend.
              </p>
            )}
            {!USE_ORG_API && !statsLoading && orgStats && (
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                Stats from local demo data. Enable VITE_USE_ORG_API for backend counters.
              </p>
            )}
          </>
        )}
      </Modal>
    </div>
  )
}

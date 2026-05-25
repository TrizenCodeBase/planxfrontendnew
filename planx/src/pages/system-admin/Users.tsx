import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import { ROLE_LABELS } from '@/mock/users'
import type { PlatformUser } from '@/types/platform'
import type { UserRole } from '@/types/auth'

export function SystemAdminUsers() {
  const {
    platformUsers,
    organizations,
    toast,
    setToast,
    createPlatformUser,
    updatePlatformUser,
    deletePlatformUser,
    changeUserRole,
  } = usePlanXStore()

  const [filter, setFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<PlatformUser | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'MEMBER' as UserRole, organizationId: '' })

  const filtered = useMemo(() => {
    return platformUsers.filter((u) => {
      const matchSearch =
        !filter ||
        u.name.toLowerCase().includes(filter.toLowerCase()) ||
        u.email.toLowerCase().includes(filter.toLowerCase())
      const matchRole = !roleFilter || u.role === roleFilter
      return matchSearch && matchRole
    })
  }, [platformUsers, filter, roleFilter])

  const handleCreate = () => {
    if (!form.name || !form.email) return
    createPlatformUser({
      name: form.name,
      email: form.email,
      role: form.role,
      organizationId: form.organizationId || undefined,
    })
    setCreateOpen(false)
    setForm({ name: '', email: '', role: 'MEMBER', organizationId: '' })
  }

  const handleUpdate = () => {
    if (!editUser) return
    updatePlatformUser(editUser.id, { name: form.name, email: form.email, organizationId: form.organizationId || undefined })
    setEditUser(null)
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Create, list, filter, update roles, and delete platform users"
        actions={<Button onClick={() => setCreateOpen(true)}>Create user</Button>}
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search name or email..." value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-xs" />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { value: '', label: 'All roles' },
            ...Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l })),
          ]}
        />
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Organization</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                    options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                  />
                </TableCell>
                <TableCell>{u.organizationName ?? '—'}</TableCell>
                <TableCell>
                  <Badge label={u.status} variant={u.status === 'active' ? 'active' : 'inactive'} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditUser(u); setForm({ name: u.name, email: u.email, role: u.role, organizationId: u.organizationId ?? '' }) }}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deletePlatformUser(u.id)} disabled={u.role === 'SYSTEM_ADMIN'}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create user" footer={
        <ModalActions onCancel={() => setCreateOpen(false)} onConfirm={handleCreate} confirmLabel="Create & send invite" />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Organization" value={form.organizationId} onChange={(e) => setForm({ ...form, organizationId: e.target.value })} options={[
            { value: '', label: 'None' },
            ...organizations.map((o) => ({ value: o.id, label: o.name })),
          ]} />
        </div>
      </Modal>

      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Update user" footer={
        <ModalActions onCancel={() => setEditUser(null)} onConfirm={handleUpdate} />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select label="Organization" value={form.organizationId} onChange={(e) => setForm({ ...form, organizationId: e.target.value })} options={[
            { value: '', label: 'None' },
            ...organizations.map((o) => ({ value: o.id, label: o.name })),
          ]} />
        </div>
      </Modal>
    </div>
  )
}

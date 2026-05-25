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
import { ORG_ROLE_OPTIONS } from '@/mock/users'

export function AdminCollaborators() {
  const { collaborators, toast, setToast, inviteCollaborator, removeCollaborator, updateCollaboratorRole } = usePlanXStore()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'MEMBER', department: '' })

  const handleInvite = () => {
    if (!form.email || !form.name) return
    inviteCollaborator(form)
    setInviteOpen(false)
    setForm({ name: '', email: '', role: 'MEMBER', department: '' })
  }

  return (
    <div>
      <PageHeader
        title="Collaborators"
        description="Invite, remove members, and assign roles"
        actions={<Button onClick={() => setInviteOpen(true)}>Invite member</Button>}
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <Card>
        <Table>
          <TableHead>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {collaborators.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.department}</TableCell>
                <TableCell>
                  <Select
                    value={c.role}
                    onChange={(e) => updateCollaboratorRole(c.id, e.target.value)}
                    options={ORG_ROLE_OPTIONS}
                  />
                </TableCell>
                <TableCell><Badge label={c.status} variant={c.status} /></TableCell>
                <TableCell>
                  <Button variant="danger" size="sm" onClick={() => removeCollaborator(c.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite member" footer={
        <ModalActions onCancel={() => setInviteOpen(false)} onConfirm={handleInvite} confirmLabel="Send invite" />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={ORG_ROLE_OPTIONS} />
        </div>
      </Modal>
    </div>
  )
}

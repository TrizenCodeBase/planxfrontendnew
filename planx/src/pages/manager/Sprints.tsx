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
import type { Sprint } from '@/types'

export function ManagerSprints() {
  const { sprints, projects, toast, setToast, createSprint, updateSprint, deleteSprint } = usePlanXStore()
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Sprint | null>(null)
  const [form, setForm] = useState({ name: '', projectId: 'proj-1', startDate: '', endDate: '', status: 'planned' as Sprint['status'] })

  const save = () => {
    if (!form.name) return
    if (edit) {
      updateSprint(edit.id, form)
      setEdit(null)
    } else {
      createSprint(form)
      setOpen(false)
    }
    setForm({ name: '', projectId: 'proj-1', startDate: '', endDate: '', status: 'planned' })
  }

  return (
    <div>
      <PageHeader title="Sprints" description="Create and manage sprints" actions={<Button onClick={() => setOpen(true)}>Create sprint</Button>} />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />
      <Card>
        <Table>
          <TableHead>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Dates</TableHeaderCell>
            <TableHeaderCell>Tasks</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {sprints.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.startDate} → {s.endDate}</TableCell>
                <TableCell>{s.taskIds.length}</TableCell>
                <TableCell><Badge label={s.status} variant={s.status} /></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => { setEdit(s); setForm({ name: s.name, projectId: s.projectId, startDate: s.startDate, endDate: s.endDate, status: s.status }) }}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteSprint(s.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={open || !!edit} onClose={() => { setOpen(false); setEdit(null) }} title={edit ? 'Edit sprint' : 'Create sprint'} footer={
        <ModalActions onCancel={() => { setOpen(false); setEdit(null) }} onConfirm={save} />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select label="Project" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} options={projects.map((p) => ({ value: p.id, label: p.name }))} />
          <Input label="Start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input label="End" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Sprint['status'] })} options={[
            { value: 'planned', label: 'Planned' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
          ]} />
        </div>
      </Modal>
    </div>
  )
}

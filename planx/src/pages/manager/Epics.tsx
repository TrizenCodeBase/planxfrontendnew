import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import type { Epic } from '@/types'

export function ManagerEpics() {
  const { epics, projects, toast, setToast, createEpic, updateEpic, deleteEpic } = usePlanXStore()
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Epic | null>(null)
  const [form, setForm] = useState({ name: '', description: '', projectId: 'proj-1', status: 'open' as Epic['status'] })

  const save = () => {
    if (!form.name) return
    if (edit) updateEpic(edit.id, form)
    else createEpic(form)
    setOpen(false)
    setEdit(null)
  }

  return (
    <div>
      <PageHeader title="Epics" description="Group related work into epics" actions={<Button onClick={() => setOpen(true)}>Create epic</Button>} />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {epics.map((epic) => (
          <Card key={epic.id} title={epic.name}>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">{epic.description}</p>
            <div className="flex items-center justify-between">
              <Badge label={epic.status} variant={epic.status} />
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => { setEdit(epic); setForm({ name: epic.name, description: epic.description, projectId: epic.projectId, status: epic.status }); setOpen(true) }}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deleteEpic(epic.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setEdit(null) }} title={edit ? 'Edit epic' : 'Create epic'} footer={
        <ModalActions onCancel={() => { setOpen(false); setEdit(null) }} onConfirm={save} />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select label="Project" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} options={projects.map((p) => ({ value: p.id, label: p.name }))} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Epic['status'] })} options={[
            { value: 'open', label: 'Open' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
          ]} />
        </div>
      </Modal>
    </div>
  )
}

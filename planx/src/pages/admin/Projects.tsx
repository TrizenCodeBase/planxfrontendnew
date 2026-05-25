import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import type { Project } from '@/types'

export function AdminProjects() {
  const { projects, toast, setToast, createProject, deleteProject, updateProject } = usePlanXStore()
  const orgProjects = projects.filter((p) => p.organizationId === 'org-1')

  const [createOpen, setCreateOpen] = useState(false)
  const [settingsProject, setSettingsProject] = useState<Project | null>(null)
  const [form, setForm] = useState({ name: '', key: '', description: '' })

  const handleCreate = () => {
    if (!form.name || !form.key) return
    createProject({
      name: form.name,
      key: form.key.toUpperCase(),
      description: form.description,
      organizationId: 'org-1',
      status: 'active',
      collaboratorIds: [],
    })
    setCreateOpen(false)
    setForm({ name: '', key: '', description: '' })
  }

  const handleSaveSettings = () => {
    if (!settingsProject) return
    updateProject(settingsProject.id, {
      name: form.name,
      key: form.key,
      description: form.description,
    })
    setSettingsProject(null)
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Create, delete, and configure organization projects"
        actions={<Button onClick={() => setCreateOpen(true)}>Create project</Button>}
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <Card>
        <Table>
          <TableHead>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Key</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {orgProjects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.key}</TableCell>
                <TableCell><Badge label={p.status} variant={p.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setSettingsProject(p); setForm({ name: p.name, key: p.key, description: p.description }) }}>
                      Settings
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteProject(p.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create project" footer={
        <ModalActions onCancel={() => setCreateOpen(false)} onConfirm={handleCreate} confirmLabel="Create" />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="PXC" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>

      <Modal open={!!settingsProject} onClose={() => setSettingsProject(null)} title="Project settings" footer={
        <ModalActions onCancel={() => setSettingsProject(null)} onConfirm={handleSaveSettings} />
      }>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}

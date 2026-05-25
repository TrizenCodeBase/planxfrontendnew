import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from '@/components/ui/Table'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'
import type { TaskPriority } from '@/types'

export function ManagerBacklog() {
  const {
    tasks,
    sprints,
    collaborators,
    projects,
    toast,
    setToast,
    createTask,
    deleteTask,
    assignTask,
    moveTaskToSprint,
  } = usePlanXStore()

  const backlog = tasks.filter((t) => !t.sprintId)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    projectId: 'proj-1',
    assigneeId: 'u-mem-1',
  })

  const handleCreate = () => {
    if (!form.title) return
    createTask({
      title: form.title,
      description: form.description,
      status: 'todo',
      priority: form.priority,
      projectId: form.projectId,
      assigneeId: form.assigneeId,
      reporterId: 'u-mgr-1',
      labels: [],
    })
    setCreateOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Backlog"
        description="Plan work, create tasks, assign collaborators, add to sprints"
        actions={<Button onClick={() => setCreateOpen(true)}>Add to backlog</Button>}
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <Card>
        <Table>
          <TableHead>
            <TableHeaderCell>Task</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Assignee</TableHeaderCell>
            <TableHeaderCell>Add to sprint</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHead>
          <TableBody>
            {backlog.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell><Badge label={t.priority} variant={t.priority} /></TableCell>
                <TableCell>
                  <Select
                    value={t.assigneeId}
                    onChange={(e) => assignTask(t.id, e.target.value)}
                    options={collaborators.map((c) => ({ value: c.id, label: c.name }))}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value=""
                    onChange={(e) => e.target.value && moveTaskToSprint(t.id, e.target.value)}
                    options={[
                      { value: '', label: 'Select sprint...' },
                      ...sprints.map((s) => ({ value: s.id, label: s.name })),
                    ]}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="danger" size="sm" onClick={() => deleteTask(t.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New backlog task" footer={
        <ModalActions onCancel={() => setCreateOpen(false)} onConfirm={handleCreate} />
      }>
        <div className="space-y-3">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select label="Project" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} options={projects.map((p) => ({ value: p.id, label: p.name }))} />
          <Select label="Assign to" value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} options={collaborators.map((c) => ({ value: c.id, label: c.name }))} />
          <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })} options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]} />
        </div>
      </Modal>
    </div>
  )
}

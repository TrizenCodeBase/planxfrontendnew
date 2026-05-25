import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { usePlanXStore } from '@/store/PlanXStore'
import { projects } from '@/mock/projects'
import type { TaskPriority } from '@/types'

export function MemberMyIssues() {
  const { user } = useAuth()
  const { tasks, projects: storeProjects, createTask, toast, setToast } = usePlanXStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: storeProjects[0]?.id ?? projects[0]?.id ?? '',
    priority: 'medium' as TaskPriority,
  })

  const myIssues = tasks.filter((t) => t.assigneeId === user?.id)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !user) return
    const created = createTask({
      title: form.title.trim(),
      description: form.description.trim() || 'No description provided.',
      status: 'todo',
      priority: form.priority,
      projectId: form.projectId,
      assigneeId: user.id,
      reporterId: user.id,
      labels: [],
    })
    setCreateOpen(false)
    setForm({ title: '', description: '', projectId: form.projectId, priority: 'medium' })
    setToast(`Issue "${created.title}" created.`)
  }

  return (
    <div>
      <PageHeader
        title="My Issues"
        description="Create and track issues assigned to you"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={14} className="mr-1 inline" />
            Create issue
          </Button>
        }
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      {myIssues.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)]">No issues assigned yet.</p>
          <Button size="sm" className="mt-3" onClick={() => setCreateOpen(true)}>
            Create your first issue
          </Button>
        </Card>
      ) : (
        <div className="border border-[var(--color-border)] rounded-[var(--radius-control)] bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Issue
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Priority
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Comments
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {myIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[#f4f5f7]"
                >
                  <td className="px-3 py-2">
                    <Link
                      to={`/member/issues/${issue.id}`}
                      className="font-medium text-[var(--color-primary)] hover:underline"
                    >
                      {issue.title}
                    </Link>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                      {issue.description}
                    </p>
                  </td>
                  <td className="px-3 py-2">
                    <Badge label={issue.status} variant={issue.status} />
                  </td>
                  <td className="px-3 py-2">
                    <Badge label={issue.priority} variant={issue.priority} />
                  </td>
                  <td className="px-3 py-2 text-[var(--color-text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare size={14} />
                      {issue.comments.length}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Link to={`/member/issues/${issue.id}`}>
                      <Button variant="secondary" size="sm">
                        View & comment
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create issue"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate}>
              Create issue
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Select
            label="Project"
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            options={storeProjects.map((p) => ({ value: p.id, label: p.name }))}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
        </form>
      </Modal>
    </div>
  )
}

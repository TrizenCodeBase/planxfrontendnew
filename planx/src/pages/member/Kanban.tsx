import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { usePlanXStore } from '@/store/PlanXStore'
import type { TaskStatus } from '@/types'

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'review', title: 'Review' },
  { status: 'done', title: 'Done' },
]

export function MemberKanban() {
  const { user } = useAuth()
  const { tasks, toast, setToast, updateTask } = usePlanXStore()
  const myIssues = tasks.filter((t) => t.assigneeId === user?.id)

  return (
    <div>
      <PageHeader title="Kanban" description="Update issue status as you progress" />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const colIssues = myIssues.filter((t) => t.status === col.status)
          return (
            <div
              key={col.status}
              className="bg-white border border-[var(--color-border)] rounded-[var(--radius-control)] p-3"
            >
              <h3 className="text-sm font-semibold mb-3 text-[var(--color-text)]">
                {col.title} ({colIssues.length})
              </h3>
              <div className="space-y-2">
                {colIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="border border-[var(--color-border)] rounded-[var(--radius-control)] p-3 bg-white"
                  >
                    <Link
                      to={`/member/issues/${issue.id}`}
                      className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                    >
                      {issue.title}
                    </Link>
                    <div className="mt-2">
                      <Badge label={issue.priority} variant={issue.priority} />
                    </div>
                    <div className="mt-2">
                      <label className="text-xs text-[var(--color-text-muted)]">Status</label>
                      <Select
                        value={issue.status}
                        onChange={(e) =>
                          updateTask(issue.id, { status: e.target.value as TaskStatus })
                        }
                        options={COLUMNS.map((c) => ({ value: c.status, label: c.title }))}
                      />
                    </div>
                  </div>
                ))}
                {colIssues.length === 0 && (
                  <p className="text-xs text-[var(--color-text-muted)] text-center py-4">No issues</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

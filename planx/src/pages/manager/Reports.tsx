import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { usePlanXStore } from '@/store/PlanXStore'

const COLORS = ['#94a3b8', '#16b3a4', '#d97706', '#059669']

export function ManagerReports() {
  const { tasks, sprints } = usePlanXStore()
  const statusCounts = ['todo', 'in_progress', 'review', 'done'].map((status) => ({
    name: status.replace('_', ' '),
    value: tasks.filter((t) => t.status === status).length,
  }))
  const activeSprint = sprints.find((s) => s.status === 'active')
  const done = tasks.filter((t) => t.status === 'done').length
  const total = tasks.length || 1

  return (
    <div>
      <PageHeader title="Team Reports" description="Track sprint and task progress" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Tasks by Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Sprint Summary">
          <dl className="space-y-3 text-sm mb-4 pb-4 border-b border-[var(--color-border)]">
            <div className="flex justify-between">
              <dt className="text-[var(--color-text-muted)]">Active Sprint</dt>
              <dd className="font-medium">{activeSprint?.name ?? 'None'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-text-muted)]">Total Tasks</dt>
              <dd className="font-medium">{tasks.length}</dd>
            </div>
          </dl>
          <ProgressBar label="Overall completion" value={done} max={total} />
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <ProgressBar
              label="In progress"
              value={tasks.filter((t) => t.status === 'in_progress').length}
              max={total}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

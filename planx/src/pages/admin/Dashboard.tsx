import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard, Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'

export function AdminDashboard() {
  const { projects, collaborators, tasks, toast, setToast } = usePlanXStore()
  const orgProjects = projects.filter((p) => p.organizationId === 'org-1')
  const orgTasks = tasks.filter((t) => orgProjects.some((p) => p.id === t.projectId))
  const openTasks = orgTasks.filter((t) => t.status !== 'done').length
  const doneTasks = orgTasks.filter((t) => t.status === 'done').length
  const completionPct = orgTasks.length ? doneTasks : 0

  return (
    <div>
      <PageHeader title="Workspace Dashboard" description="Organization overview and activity" />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Projects" value={orgProjects.filter((p) => p.status === 'active').length} />
        <StatCard label="Collaborators" value={collaborators.length} />
        <StatCard label="Open Tasks" value={openTasks} />
        <StatCard
          label="Task completion"
          value={`${orgTasks.length ? Math.round((doneTasks / orgTasks.length) * 100) : 0}%`}
          progress={completionPct}
          progressMax={orgTasks.length || 1}
        />
      </div>
      <Card title="Sprint health">
        <ProgressBar label="Tasks completed" value={doneTasks} max={orgTasks.length || 1} />
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <ProgressBar label="Active projects" value={orgProjects.filter((p) => p.status === 'active').length} max={orgProjects.length || 1} />
        </div>
      </Card>
    </div>
  )
}

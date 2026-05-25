import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IssueComments } from '@/components/issues/IssueComments'
import { usePlanXStore } from '@/store/PlanXStore'

export function ViewerIssueDetails() {
  const { issueId } = useParams()
  const { tasks } = usePlanXStore()
  const issue = tasks.find((t) => t.id === issueId)

  if (!issue) {
    return (
      <div>
        <PageHeader title="Issue not found" />
        <Link to="/viewer">
          <Button variant="secondary" size="sm">
            Back to Issues
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={issue.title}
        description="Read-only issue · Comments are enabled"
        actions={
          <Link to="/viewer">
            <Button variant="secondary" size="sm">
              Back to Issues
            </Button>
          </Link>
        }
      />
      <div className="mb-4 px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-control)] bg-[#deebff] text-[var(--color-primary)]">
        View-only access. You cannot edit this issue — only add comments below.
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Issue details">
            <p className="text-sm text-[var(--color-text)] mb-4">{issue.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge label={issue.status} variant={issue.status} />
              <Badge label={issue.priority} variant={issue.priority} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[var(--color-text-muted)]">Project</dt>
                <dd className="font-medium mt-0.5">{issue.projectId}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-muted)]">Assignee</dt>
                <dd className="font-medium mt-0.5">{issue.assigneeId}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-muted)]">Due date</dt>
                <dd className="font-medium mt-0.5">{issue.dueDate ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-text-muted)]">Created</dt>
                <dd className="font-medium mt-0.5">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
            {issue.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {issue.labels.map((lbl) => (
                  <span
                    key={lbl}
                    className="px-2 py-0.5 text-xs border border-[var(--color-border)] rounded-[var(--radius-control)]"
                  >
                    {lbl}
                  </span>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <IssueComments issueId={issue.id} />
          </Card>
        </div>
        <Card title="Summary">
          <p className="text-sm text-[var(--color-text-muted)]">
            {issue.comments.length} comment{issue.comments.length !== 1 ? 's' : ''}
          </p>
        </Card>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { usePlanXStore } from '@/store/PlanXStore'

export function ViewerBoard() {
  const { tasks } = usePlanXStore()

  return (
    <div>
      <PageHeader
        title="Issues"
        description="Read-only view of all issues. You can open details and add comments."
      />
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((issue) => (
              <tr
                key={issue.id}
                className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[#f4f5f7]"
              >
                <td className="px-3 py-2">
                  <p className="font-medium text-[var(--color-text)]">{issue.title}</p>
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
                  <Link to={`/viewer/issues/${issue.id}`}>
                    <Button variant="secondary" size="sm">
                      View details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

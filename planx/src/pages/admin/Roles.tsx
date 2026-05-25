import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { ORG_ROLE_OPTIONS } from '@/mock/users'

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['Organization dashboard', 'Create/delete projects', 'Invite/remove collaborators', 'Assign roles', 'Label management'],
  MANAGER: ['Create/manage sprints', 'Backlog management', 'Assign issues', 'Basic reports', 'Epic management'],
  MEMBER: ['My issues view', 'Create issues', 'Kanban board', 'Update issue status', 'Comments'],
  VIEWER: ['Read-only issues board', 'Read-only issue details', 'Comments only'],
}

export function AdminRoles() {
  return (
    <div>
      <PageHeader title="Roles & Permissions" description="Control access levels for collaborators" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ORG_ROLE_OPTIONS.map((r) => (
          <Card key={r.value} title={r.label}>
            <ul className="space-y-1.5">
              {(ROLE_PERMISSIONS[r.value] ?? []).map((p) => (
                <li key={p} className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-primary)] shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}

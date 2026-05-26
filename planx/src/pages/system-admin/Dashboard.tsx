import { useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard, Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { usePlanXStore } from '@/store/PlanXStore'

export function SystemAdminDashboard() {
  const { organizations, platformUsers, loadOrganizations } = usePlanXStore()

  useEffect(() => {
    void loadOrganizations()
  }, [loadOrganizations])

  const activeOrgs = organizations.filter((o) => o.status === 'active').length
  const inactiveOrgs = organizations.filter((o) => o.status === 'suspended').length
  const freeOrgs = organizations.filter((o) => o.plan === 'free').length
  const paidOrgs = organizations.filter((o) => o.plan !== 'free').length
  const totalOrgs = organizations.length || 1

  return (
    <div>
      <PageHeader
        title="Platform Dashboard"
        description="System-wide metrics across all organizations"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Organizations" value={organizations.length} />
        <StatCard
          label="Active Organizations"
          value={activeOrgs}
          subtext={`${inactiveOrgs} inactive/suspended`}
          progress={activeOrgs}
          progressMax={totalOrgs}
        />
        <StatCard label="Total Users (Platform)" value={platformUsers.length} />
        <StatCard label="Free Tier Orgs" value={freeOrgs} />
        <StatCard
          label="Paid Tier Orgs"
          value={paidOrgs}
          subtext="Pro + Enterprise"
          progress={paidOrgs}
          progressMax={totalOrgs}
        />
      </div>
      <Card title="Platform utilization">
        <ProgressBar label="Active org rate" value={activeOrgs} max={totalOrgs} />
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <ProgressBar label="Paid tier share" value={paidOrgs} max={totalOrgs} />
        </div>
      </Card>
    </div>
  )
}

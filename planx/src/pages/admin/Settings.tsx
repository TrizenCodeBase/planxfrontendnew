import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'

export function AdminSettings() {
  const { toast, setToast } = usePlanXStore()

  return (
    <div>
      <PageHeader title="Organization Settings" description="Basic organization configuration" />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />
      <div className="max-w-lg space-y-4">
        <Card title="Organization Profile">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <input defaultValue="Trizen Ventures" className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default project visibility</label>
              <select className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus-ring" defaultValue="private">
                <option value="private">Private</option>
                <option value="team">Team only</option>
              </select>
            </div>
            <Button size="sm" onClick={() => setToast('Organization settings saved.')}>Save changes</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

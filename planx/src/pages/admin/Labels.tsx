import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal, ModalActions } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ToastBanner } from '@/components/ui/Toast'
import { usePlanXStore } from '@/store/PlanXStore'

export function AdminLabels() {
  const { labels, toast, setToast, createLabel, deleteLabel } = usePlanXStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#16b3a4')

  return (
    <div>
      <PageHeader
        title="Label Management"
        description="Organize tasks with custom labels"
        actions={<Button onClick={() => setOpen(true)}>Add label</Button>}
      />
      <ToastBanner message={toast} onDismiss={() => setToast('')} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {labels.map((lbl) => (
          <Card key={lbl.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: lbl.color }} />
                <span className="text-sm font-medium">{lbl.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteLabel(lbl.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New label" footer={
        <ModalActions onCancel={() => setOpen(false)} onConfirm={() => { if (name) createLabel(name, color); setOpen(false); setName('') }} />
      }>
        <div className="space-y-3">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}

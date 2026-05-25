import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, children, footer, wide }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div
        className={`bg-white rounded-[var(--radius-control)] border border-[var(--color-border)] w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-auto`}
        role="dialog"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--color-text)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[var(--radius-control)] hover:bg-[var(--color-surface-muted)] transition-colors duration-150 text-[var(--color-text-muted)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--color-border)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  danger,
}: {
  onCancel: () => void
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}) {
  return (
    <>
      <Button variant="secondary" size="sm" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant={danger ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </>
  )
}

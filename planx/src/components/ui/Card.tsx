import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export function Card({ children, className = '', title, description }: CardProps) {
  return (
    <div className={`bg-white border border-[var(--color-border)] rounded-[var(--radius-control)] ${className}`}>
      {(title || description) && (
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          {title && <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>}
          {description && (
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{description}</p>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

export function StatCard({
  label,
  value,
  subtext,
  progress,
  progressMax,
}: {
  label: string
  value: string | number
  subtext?: string
  progress?: number
  progressMax?: number
}) {
  return (
    <Card>
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      <p className="text-2xl font-semibold text-[var(--color-text)] mt-1">{value}</p>
      {subtext && <p className="text-xs text-[var(--color-text-muted)] mt-1">{subtext}</p>}
      {progress !== undefined && (
        <>
          <div className="mt-3 pt-3 border-t border-[var(--color-border)]" />
          <ProgressBar value={progress} max={progressMax} showPercent />
        </>
      )}
    </Card>
  )
}

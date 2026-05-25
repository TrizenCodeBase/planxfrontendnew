interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  className = '',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-[var(--color-text-muted)]">{label}</span>}
          {showPercent && (
            <span className="text-sm font-medium text-[var(--color-text)]">{pct}%</span>
          )}
        </div>
      )}
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-progress-track)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-150"
          style={{
            width: `${pct}%`,
            backgroundColor: 'var(--color-primary)',
          }}
        />
      </div>
    </div>
  )
}

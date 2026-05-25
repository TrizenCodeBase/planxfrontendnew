import type { ReactNode } from 'react'

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-[var(--radius-control)] bg-white">
      <table className="w-full text-sm text-left border-collapse">{children}</table>
    </div>
  )
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        {children}
      </tr>
    </thead>
  )
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="px-3 py-2 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide whitespace-nowrap">
      {children}
    </th>
  )
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[#f4f5f7] transition-colors duration-150">
      {children}
    </tr>
  )
}

export function TableCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-3 py-2 text-[var(--color-text)] align-middle ${className}`}>{children}</td>
  )
}

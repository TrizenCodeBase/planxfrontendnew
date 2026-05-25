const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  todo: 'bg-slate-100 text-slate-700 border-slate-200',
  in_progress: 'bg-teal-50 text-teal-800 border-teal-200',
  review: 'bg-amber-50 text-amber-700 border-amber-200',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  open: 'bg-slate-100 text-slate-700 border-slate-200',
  planned: 'bg-violet-50 text-violet-700 border-violet-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Late: 'bg-amber-50 text-amber-700 border-amber-200',
  Leave: 'bg-slate-100 text-slate-600 border-slate-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-slate-100 text-slate-700 border-slate-200',
  high: 'bg-amber-50 text-amber-700 border-amber-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
}

export function Badge({ label, variant }: { label: string; variant?: string }) {
  const key = variant ?? label.toLowerCase().replace(/\s+/g, '_')
  const style = statusStyles[key] ?? 'bg-slate-100 text-slate-700 border-slate-200'
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${style}`}>
      {label.replace(/_/g, ' ')}
    </span>
  )
}

import { KANBAN_PREVIEW, SPRINT_BURNDOWN, DASHBOARD_STATS } from '@/mock/landing'

const columnColors = ['#e8ecf4', '#d4e8f7', '#fef3c7', '#d1fae5']

export function HeroMockup() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
      <div className="absolute -inset-3 rounded-lg bg-[var(--color-primary)]/8 -z-10" aria-hidden />
      <div className="bg-white border border-[var(--color-border)] rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-[var(--color-text-muted)]">PlanX — Q2 Delivery Hub</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {DASHBOARD_STATS.slice(0, 3).map((s) => (
              <div key={s.label} className="p-2 border border-[var(--color-border)] rounded-[var(--radius-control)]">
                <p className="text-[10px] text-[var(--color-text-muted)]">{s.label}</p>
                <p className="text-sm font-semibold text-[var(--color-text)]">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {KANBAN_PREVIEW.map((col, i) => (
              <div key={col.column} className="rounded-[var(--radius-control)] p-1.5" style={{ background: columnColors[i] }}>
                <p className="text-[9px] font-medium text-[var(--color-text-muted)] mb-1">{col.column}</p>
                {col.items.map((item) => (
                  <div
                    key={item}
                    className="mb-1 px-1.5 py-1 text-[9px] bg-white border border-[var(--color-border)] rounded-[var(--radius-control)] text-[var(--color-text)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardPreviewGrid() {
  const maxBurndown = Math.max(...SPRINT_BURNDOWN)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 md:col-span-2 lg:col-span-1">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Analytics</p>
        <h3 className="font-display font-semibold text-lg text-[var(--color-text)] mt-1">Delivery overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {DASHBOARD_STATS.map((s) => (
            <div key={s.label} className="p-3 border border-[var(--color-border)] rounded-[var(--radius-control)]">
              <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
              <p className="text-xl font-semibold text-[var(--color-primary)] mt-0.5">{s.value}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{s.change}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Kanban</p>
        <h3 className="font-display font-semibold text-lg text-[var(--color-text)] mt-1">Sprint 14 board</h3>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {KANBAN_PREVIEW.map((col, i) => (
            <div key={col.column}>
              <p className="text-[10px] font-medium text-[var(--color-text-muted)] mb-1">{col.column}</p>
              <div className="space-y-1">
                {col.items.slice(0, 2).map((item) => (
                  <div
                    key={item}
                    className="text-[10px] px-2 py-1.5 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[var(--radius-control)]"
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
                      style={{ background: columnColors[i] }}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Sprints</p>
        <h3 className="font-display font-semibold text-lg text-[var(--color-text)] mt-1">Burndown — Sprint 14</h3>
        <div className="flex items-end gap-1 h-28 mt-4">
          {SPRINT_BURNDOWN.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px] bg-[var(--color-primary)]/80 hover:bg-[var(--color-primary)] transition-colors duration-150"
              style={{ height: `${(v / maxBurndown) * 100}%` }}
              title={`Day ${i + 1}: ${v} pts`}
            />
          ))}
        </div>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-2">10-day sprint · 32 pts remaining</p>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 md:col-span-2">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Organization</p>
        <h3 className="font-display font-semibold text-lg text-[var(--color-text)] mt-1">Workspace insights</h3>
        <div className="mt-4 space-y-3">
          {[
            { org: 'Trizen Ventures', users: 48, health: 92 },
            { org: 'Nova Labs', users: 31, health: 88 },
            { org: 'Helix Systems', users: 22, health: 95 },
          ].map((row) => (
            <div key={row.org} className="flex items-center gap-3 text-sm">
              <span className="w-28 shrink-0 font-medium text-[var(--color-text)]">{row.org}</span>
              <span className="text-xs text-[var(--color-text-muted)] w-16">{row.users} users</span>
              <div className="flex-1 h-2 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-150"
                  style={{ width: `${row.health}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--color-primary)] w-10 text-right">{row.health}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

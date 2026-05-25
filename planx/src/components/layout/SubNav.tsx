import { NavLink, useLocation } from 'react-router-dom'

export interface SubNavTab {
  label: string
  path: string
  end?: boolean
}

interface SubNavProps {
  tabs: SubNavTab[]
}

export function SubNav({ tabs }: SubNavProps) {
  const location = useLocation()
  if (tabs.length <= 1) return null

  return (
    <nav className="bg-white border-b border-[var(--color-border)] px-6 flex gap-0 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.end
          ? location.pathname === tab.path
          : location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`)
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={() =>
              `px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 border-b-2 -mb-px ${
                isActive
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-primary)]'
              }`
            }
          >
            {tab.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

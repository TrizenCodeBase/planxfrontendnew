import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { SubNav } from './SubNav'
import { getSubNavTabs } from './subNavConfig'
import { useAuth } from '@/hooks/useAuth'

export function AppLayout() {
  const { user } = useAuth()
  const subNavTabs = getSubNavTabs(user?.role)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <SubNav tabs={subNavTabs} />
          <main className="flex-1 p-5 overflow-auto bg-[var(--color-surface-muted)]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function UnauthorizedPage() {
  const { homePath } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-slate-300">403</p>
        <h1 className="text-xl font-semibold text-[var(--color-text)] mt-4">Access denied</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          You do not have permission to view this page.
        </p>
        <Link to={homePath} className="inline-block mt-6">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

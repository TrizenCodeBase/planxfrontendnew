import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  const { user, homePath } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-slate-300">404</p>
        <h1 className="text-xl font-semibold text-[var(--color-text)] mt-4">Page not found</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          The page you are looking for does not exist.
        </p>
        <Link to={user ? homePath : '/login'} className="inline-block mt-6">
          <Button>{user ? 'Go to dashboard' : 'Go to login'}</Button>
        </Link>
      </div>
    </div>
  )
}

import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROLE_LABELS } from '@/mock/users'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-12 bg-[var(--color-primary)] flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-white tracking-tight">PlanX</span>
        <span className="text-xs text-white/80 hidden sm:inline">Enterprise</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white leading-tight">{user?.name}</p>
          <p className="text-xs text-white/75">
            {user?.role ? ROLE_LABELS[user.role] : ''}
          </p>
        </div>
        <div className="w-7 h-7 rounded-[var(--radius-control)] bg-white/20 flex items-center justify-center text-xs font-semibold text-white">
          {user?.name?.charAt(0) ?? '?'}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-[var(--radius-control)] transition-colors duration-150"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROLE_HOME } from '@/types/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

const DEMO_HINTS = [
  { role: 'System Admin', email: 'demo@trizenventures.com', password: 'demo123' },
  { role: 'Company Admin', email: 'admin@trizenventures.com', password: 'admin123' },
  { role: 'Manager', email: 'supervisor@trizenventures.com', password: 'supervisor123' },
  { role: 'Employee', email: 'employee@trizenventures.com', password: 'employee123' },
  { role: 'Viewer', email: 'viewer@trizenventures.com', password: 'viewer123' },
]

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={ROLE_HOME[user.role]} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const authenticated = await login(email, password)
    if (authenticated) {
      navigate(ROLE_HOME[authenticated.role])
    } else {
      setError('Invalid email or password.')
    }
    setSubmitting(false)
  }

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-surface-muted)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">PlanX</h1>
          </a>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Enterprise issue & project management
          </p>
          <a href="/" className="text-xs text-[var(--color-primary)] hover:underline mt-2 inline-block">
            ← Back to homepage
          </a>
        </div>

        <Card>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <Card className="mt-4" title="Demo accounts" description="Click to autofill credentials">
          <ul className="space-y-2">
            {DEMO_HINTS.map((hint) => (
              <li key={hint.email}>
                <button
                  type="button"
                  onClick={() => fillDemo(hint.email, hint.password)}
                  className="w-full text-left px-3 py-2 text-sm rounded-[var(--radius-control)] border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] transition-colors duration-150"
                >
                  <span className="font-medium text-[var(--color-text)]">{hint.role}</span>
                  <span className="block text-xs text-[var(--color-text-muted)]">{hint.email}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

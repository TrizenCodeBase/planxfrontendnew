import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] border border-[var(--color-primary)]',
  secondary:
    'bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
  ghost: 'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] border border-transparent',
  danger: 'bg-[var(--color-danger)] text-white hover:bg-red-700 border border-[var(--color-danger)]',
}

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-[var(--radius-control)] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

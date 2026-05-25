const controlClass =
  'w-full px-2 py-1.5 border border-[var(--color-border)] rounded-[var(--radius-control)] text-sm bg-white focus-ring transition-colors duration-150'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text)] mb-1">
          {label}
        </label>
      )}
      <input id={inputId} className={`${controlClass} ${className}`} {...props} />
    </div>
  )
}

export function Select({
  label,
  options,
  className = '',
  ...props
}: {
  label?: string
  options: { value: string; label: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const selectId = props.id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--color-text)] mb-1">
          {label}
        </label>
      )}
      <select id={selectId} className={`${controlClass} ${className}`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Textarea({
  label,
  className = '',
  ...props
}: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = props.id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text)] mb-1">
          {label}
        </label>
      )}
      <textarea id={id} className={`${controlClass} min-h-[72px] ${className}`} {...props} />
    </div>
  )
}

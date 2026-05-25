export function ToastBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  if (!message) return null
  return (
    <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 flex justify-between items-center">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-emerald-600 hover:text-emerald-800 text-xs">
          Dismiss
        </button>
      )}
    </div>
  )
}

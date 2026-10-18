import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { ToastContext } from './toast-context'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((next: string) => {
    window.clearTimeout(timer.current)
    setMessage(next)
    timer.current = window.setTimeout(() => setMessage(''), 2400)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-[448px] justify-center"
      >
        {message && (
          <div className="flex items-center gap-2 rounded-md bg-inv px-4 py-3 font-sans text-sm font-medium text-on-inv shadow-lg">
            <CheckCircle2 size={18} aria-hidden="true" />
            {message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

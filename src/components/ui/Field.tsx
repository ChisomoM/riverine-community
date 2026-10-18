import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const control =
  'w-full rounded-sm border bg-surface px-3.5 font-sans text-base text-ink placeholder:text-muted'

interface FieldProps {
  label: ReactNode
  error?: string
  className?: string
}

function Shell({ id, label, error, className, children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="font-sans text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-err`} className="font-sans text-[13px] text-bad-fg">
          {error}
        </span>
      )}
    </div>
  )
}

const borderFor = (error?: string) => (error ? 'border-2 border-bad-fg' : 'border-line-strong')

export function TextField({ label, error, className, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Shell id={id} label={label} error={error} className={className}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(control, 'h-[52px]', borderFor(error))}
        {...props}
      />
    </Shell>
  )
}

export function SelectField({
  label,
  error,
  className,
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <Shell id={id} label={label} error={error} className={className}>
      <select id={id} className={cn(control, 'h-[52px]', borderFor(error))} {...props}>
        {children}
      </select>
    </Shell>
  )
}

export function TextAreaField({ label, error, className, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Shell id={id} label={label} error={error} className={className}>
      <textarea id={id} className={cn(control, 'py-3 leading-[22px]', borderFor(error))} {...props} />
    </Shell>
  )
}

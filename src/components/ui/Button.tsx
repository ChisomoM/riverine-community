import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ok'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-sans font-semibold no-underline transition-colors disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary: 'border-0 bg-inv text-on-inv disabled:bg-muted',
  secondary: 'border border-line-strong bg-surface text-ink',
  ok: 'border border-ok-fg bg-ok-bg text-ok-fg',
}

const sizes = {
  md: 'h-12 text-[15px]',
  lg: 'h-14 text-base',
  sm: 'h-11 text-sm',
}

interface Common {
  variant?: Variant
  size?: keyof typeof sizes
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: Common & LinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], variant === 'primary' && 'text-on-inv', className)} {...props} />
}

/** Round 44px icon button used for back, search and bell. */
export function IconButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'relative flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink',
        className,
      )}
      {...props}
    />
  )
}

export function IconLink({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink',
        className,
      )}
      {...props}
    />
  )
}

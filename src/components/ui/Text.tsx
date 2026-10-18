import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Small uppercase label in the logo's letter-spaced style. */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('font-sans text-[11px] font-semibold leading-4 tracking-eyebrow text-muted', className)}>
      {children}
    </span>
  )
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('m-0 font-display text-[22px] font-medium leading-[30px] tracking-[0.02em]', className)}>{children}</h2>
}

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cn('m-0 font-display text-[28px] font-medium leading-9 tracking-[0.02em]', className)}>{children}</h1>
}

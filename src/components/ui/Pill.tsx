import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

import { toneClass, type Tone } from './tone'

export function Pill({ tone = 'surface', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-sm px-2 font-sans text-[11px] font-semibold tracking-[0.06em]',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

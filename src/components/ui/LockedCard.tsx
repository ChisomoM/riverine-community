import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { Eyebrow } from './Text'

/** Shown where a feature needs an approved membership. */
export function LockedCard({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-line-strong bg-surface p-5">
      <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-muted">
        <Lock size={18} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <Eyebrow>{eyebrow}</Eyebrow>
      <span className="font-display text-[22px] font-medium leading-[30px]">{title}</span>
      <span className="text-[15px] leading-6 text-muted">{body}</span>
      {children}
    </div>
  )
}

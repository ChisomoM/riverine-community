import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Chip({
  selected,
  className,
  ...props
}: { selected: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'h-10 shrink-0 whitespace-nowrap rounded-full border px-[18px] font-sans text-sm',
        selected
          ? 'border-inv bg-inv font-semibold text-on-inv'
          : 'border-line-strong bg-surface font-medium text-ink',
        className,
      )}
      {...props}
    />
  )
}

/** Horizontal row of chips that bleeds to the screen edge. */
export function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {children}
    </div>
  )
}

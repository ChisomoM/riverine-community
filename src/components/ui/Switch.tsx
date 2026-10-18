import { cn } from '@/lib/utils'

/** Track and knob only. Wrap it in a button with role="switch" for the hit area. */
export function SwitchTrack({ on, danger }: { on: boolean; danger?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative h-[26px] w-11 shrink-0 rounded-full transition-colors',
        on ? (danger ? 'bg-bad-fg' : 'bg-ink') : 'bg-line-strong',
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] size-5 rounded-full bg-surface transition-[left]',
          on ? 'left-[21px]' : 'left-[3px]',
        )}
      />
    </span>
  )
}

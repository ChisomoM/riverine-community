import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { BottomNav } from './BottomNav'

interface ScreenProps {
  /** Show the bottom tab bar */
  nav?: boolean
  /** Extra classes for the content column */
  className?: string
  children: ReactNode
}

/** Phone-width column. On a desktop browser it sits centred so the demo still looks like an app. */
export function Screen({ nav = false, className, children }: ScreenProps) {
  return (
    <>
      <main
        className={cn(
          'mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-7 bg-bg px-4 pb-8 pt-5 sm:border-x sm:border-line',
          nav && 'pb-[116px]',
          className,
        )}
      >
        {children}
      </main>
      {nav && <BottomNav />}
    </>
  )
}

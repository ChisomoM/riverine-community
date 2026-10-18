import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconLink } from '@/components/ui/Button'
import { PageTitle } from '@/components/ui/Text'

/** Back arrow and page title used by sub screens. */
export function TopBar({ to, backLabel, title, children }: { to: string; backLabel: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <IconLink to={to} aria-label={backLabel}>
        <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
      </IconLink>
      <PageTitle className="flex-1 !text-2xl">{title}</PageTitle>
      {children}
    </div>
  )
}

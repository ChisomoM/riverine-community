import { useMemo, useState } from 'react'
import { FileDown, Heart, ShieldCheck } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { TopBar } from '@/components/layout/TopBar'
import { Button, LinkButton } from '@/components/ui/Button'
import { Chip, ChipRow } from '@/components/ui/Chip'
import { LockedCard } from '@/components/ui/LockedCard'
import { Pill } from '@/components/ui/Pill'
import type { Gift, GiftCategory } from '@/data/types'
import { monthHeading, monthOnly, money, shortDay } from '@/lib/format'
import { categoryLabel, networkLabel, summarise, useGifts } from '@/repos/giving'
import { useAccess } from '@/repos/members'

const FILTERS = ['All', 'Tithe', 'Offering', 'Other'] as const
type Filter = (typeof FILTERS)[number]

const CATEGORY_COLOR: Record<GiftCategory, string> = {
  tithe: 'text-clay-fg',
  offering: 'text-blue-fg',
  building: 'text-olive-fg',
  retreat: 'text-sand-fg',
}
const CATEGORY_FILL: Record<GiftCategory, string> = {
  tithe: 'bg-clay-fg',
  offering: 'bg-blue-fg',
  building: 'bg-olive-fg',
  retreat: 'bg-sand-fg',
}

const matches = (g: Gift, f: Filter) =>
  f === 'All' || (f === 'Other' ? g.category === 'building' || g.category === 'retreat' : g.category === f.toLowerCase())

export default function GivingHistory() {
  const access = useAccess()
  const gifts = useGifts()
  const [filter, setFilter] = useState<Filter>('All')

  const summary = useMemo(() => summarise(gifts), [gifts])
  const months = useMemo(() => {
    const kept = gifts.filter((g) => matches(g, filter)).sort((a, b) => b.date.localeCompare(a.date))
    const groups: { label: string; items: Gift[] }[] = []
    for (const g of kept) {
      const label = monthHeading(g.date)
      const last = groups[groups.length - 1]
      if (last?.label === label) last.items.push(g)
      else groups.push({ label, items: [g] })
    }
    return groups
  }, [gifts, filter])

  const paidDates = gifts.filter((g) => g.status === 'paid').map((g) => g.date).sort()
  const span = paidDates.length ? `${monthOnly(paidDates[0])} to ${monthOnly(paidDates[paidDates.length - 1])}` : ''

  if (access !== 'member') {
    return (
      <Screen>
        <TopBar to="/give" backLabel="Back to give" title="My giving" />
        <LockedCard
          eyebrow={access === 'pending' ? 'PENDING APPROVAL' : 'MEMBERS ONLY'}
          title={access === 'pending' ? 'Almost there' : 'Keep a giving history'}
          body={
            access === 'pending'
              ? 'Your giving history unlocks once the pastoral team approves your membership.'
              : 'Become a member to see every gift, download a statement and keep your receipts in one place.'
          }
        >
          {access === 'visitor' && (
            <LinkButton to="/join" className="mt-1 px-5">
              Start membership
            </LinkButton>
          )}
        </LockedCard>
      </Screen>
    )
  }

  return (
    <Screen className="gap-[22px]">
      <TopBar to="/give" backLabel="Back to give" title="My giving" />

      <section aria-label="2026 summary" className="flex flex-col gap-4 rounded-md border border-clay-bd bg-clay-bg p-5">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[11px] font-semibold tracking-eyebrow text-clay-fg">GIVEN IN 2026</span>
          <span className="font-display text-[40px] font-semibold leading-[48px]">{money(summary.total)}</span>
          <span className="font-sans text-[13px] text-muted">
            {summary.count} gifts{span && ` · ${span}`}
          </span>
        </div>
        <div
          className="flex h-2.5 gap-0.5 overflow-hidden rounded-full"
          role="img"
          aria-label={summary.byCategory
            .map((c) => `${c.label} ${summary.total ? Math.round((c.total / summary.total) * 100) : 0} percent`)
            .join(', ')}
        >
          {summary.byCategory
            .filter((c) => c.total > 0)
            .map((c) => (
              <span key={c.id} className={CATEGORY_FILL[c.id]} style={{ width: `${(c.total / summary.total) * 100}%` }} />
            ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 font-sans text-[13px]">
          {summary.byCategory.map((c) => (
            <span key={c.id} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-sm ${CATEGORY_FILL[c.id]}`} />
              {c.id === 'building' ? 'Building' : c.id === 'retreat' ? 'Retreat' : c.label}
              <strong className="ml-auto">{money(c.total)}</strong>
            </span>
          ))}
        </div>
      </section>

      <Button variant="secondary" size="lg" className="no-print" onClick={() => window.print()}>
        <FileDown size={20} strokeWidth={1.5} aria-hidden="true" />
        Download 2026 statement (PDF)
      </Button>

      <section aria-label="Gifts" className="flex flex-col gap-3">
        <div className="no-print">
          <ChipRow label="Filter gifts">
            {FILTERS.map((f) => (
              <Chip key={f} selected={filter === f} onClick={() => setFilter(f)} className="px-4">
                {f}
              </Chip>
            ))}
          </ChipRow>
        </div>
        {months.map((m) => (
          <div key={m.label} className="flex flex-col gap-2">
            <h2 className="m-0 mt-1 font-sans text-[13px] font-semibold tracking-eyebrow text-muted">{m.label}</h2>
            <div className="divide-y divide-line rounded-md border border-line bg-surface">
              {m.items.map((g) => {
                const failed = g.status === 'failed'
                return (
                  <div key={g.id} className="flex items-center gap-3 px-3.5 py-3">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-2 ${CATEGORY_COLOR[g.category]}`}>
                      <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 grow flex-col gap-0.5 font-sans">
                      <span className="text-[15px] font-semibold">{categoryLabel(g.category)}</span>
                      <span className="text-xs text-muted">
                        {shortDay(g.date)} · {networkLabel(g.network)}
                      </span>
                    </span>
                    <span className="flex flex-col items-end gap-1 font-sans">
                      <span className={`text-[15px] font-semibold ${failed ? 'line-through' : ''}`}>{money(g.amount)}</span>
                      <Pill tone={failed ? 'bad' : 'ok'} className="h-5 px-1.5 leading-5">
                        {failed ? 'Failed' : 'Paid'}
                      </Pill>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {months.length === 0 && (
          <div className="rounded-md border border-dashed border-line-strong px-4 py-6 text-center text-[15px] text-muted">
            No gifts of this kind yet.
          </div>
        )}
      </section>

      <p className="m-0 flex gap-2 font-sans text-[13px] leading-[19px] text-muted">
        <ShieldCheck size={18} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
        Only you and the finance team see this.
      </p>
    </Screen>
  )
}

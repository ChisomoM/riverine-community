import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Bookmark, CalendarDays, ChevronRight, Heart, MapPin, Play, Search, Share2, UserPlus, Users, Wallet, BookOpen } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { Button, IconButton, LinkButton } from '@/components/ui/Button'
import { Chip, ChipRow } from '@/components/ui/Chip'
import { Emblem } from '@/components/ui/Emblem'
import { EventArt } from '@/components/ui/EventArt'
import { Pill } from '@/components/ui/Pill'
import { Eyebrow, SectionTitle } from '@/components/ui/Text'
import { useToast } from '@/components/ui/toast-context'
import { DEMO_TODAY, lastSunday, latestTeaching, verseOfTheDay } from '@/data/seed'
import type { Ministry } from '@/data/types'
import { dayRange, eventMonth, goingLabel, ministryLabel, MINISTRY_TONE } from '@/lib/events'
import { dayOfMonth, firstName, greetingDate, monthAbbr, shortDay } from '@/lib/format'
import { cn } from '@/lib/utils'
import { goingCount, EventsRepo, useEvents, useRsvps } from '@/repos/events'
import { useAccess, useCurrentMember } from '@/repos/members'

const FILTERS: ('All' | Ministry)[] = ['All', 'Men', 'Women', 'Youth', 'Children']

export default function Home() {
  const toast = useToast()
  const member = useCurrentMember()
  const access = useAccess()
  const events = useEvents()
  const rsvps = useRsvps()
  const [filter, setFilter] = useState<'All' | Ministry>('All')
  const [unread, setUnread] = useState(true)
  const [saved, setSaved] = useState(false)

  const sorted = useMemo(() => [...events].sort((a, b) => a.start.localeCompare(b.start)), [events])
  const featured = sorted.find((e) => e.featured)
  const list = sorted.filter((e) => filter === 'All' || e.ministry === filter)

  const featuredGoing = featured ? rsvps.includes(featured.id) : false
  const featuredCount = featured ? goingCount(featured, rsvps) : 0

  const shareVerse = async () => {
    const text = `${verseOfTheDay.text} ${verseOfTheDay.ref}`
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // Cancelled: nothing to do
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      toast('Verse copied')
    } catch {
      toast('Sharing is not available on this device')
    }
  }

  const join =
    access === 'member'
      ? { to: '/me', label: 'My profile' }
      : access === 'pending'
        ? { to: '/me', label: 'Membership' }
        : { to: '/join', label: 'Join us' }

  return (
    <Screen nav>
      <header className="flex items-center gap-3">
        <Emblem size={48} className="shrink-0" />
        <div className="flex min-w-0 grow flex-col gap-0.5">
          <Eyebrow>{greetingDate(DEMO_TODAY)}</Eyebrow>
          <span className="font-display text-xl font-medium leading-[26px] tracking-[0.02em]">
            {member ? `Good morning, ${firstName(member.name)}` : 'Good morning'}
          </span>
        </div>
        <IconButton aria-label="Search" onClick={() => toast('Search arrives in the next phase')}>
          <Search size={20} strokeWidth={1.5} aria-hidden="true" />
        </IconButton>
        <IconButton
          aria-label={unread ? 'Notifications, 2 new' : 'Notifications'}
          onClick={() => {
            setUnread(false)
            toast("You're all caught up")
          }}
        >
          <Bell size={20} strokeWidth={1.5} aria-hidden="true" />
          {unread && <span className="absolute right-2 top-[7px] size-[9px] rounded-full border-2 border-surface bg-dot" />}
        </IconButton>
      </header>

      <section
        aria-label="Verse of the day"
        className="flex flex-col overflow-hidden rounded-md border border-verse-bd bg-verse-bg text-verse-ink"
      >
        <div className="flex flex-col gap-3 px-5 pb-1 pt-5">
          <span className="font-sans text-[11px] font-semibold leading-4 tracking-eyebrow text-verse-muted">VERSE OF THE DAY</span>
          <p className="m-0 text-[21px] italic leading-[31px]">{verseOfTheDay.text}</p>
          <span className="font-sans text-[13px] font-medium leading-5 text-verse-muted">{verseOfTheDay.ref}</span>
        </div>
        <svg viewBox="0 0 390 110" width="100%" height="110" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="block">
          <circle cx="300" cy="34" r="20" style={{ fill: 'var(--sun)' }} opacity="0.5" />
          <path d="M0 62 C60 36 120 44 180 56 C240 68 300 34 390 46 V110 H0Z" style={{ fill: 'var(--hill1)' }} />
          <rect x="64" y="34" width="5" height="34" style={{ fill: 'var(--tree)' }} />
          <circle cx="66" cy="30" r="17" style={{ fill: 'var(--tree)' }} />
          <circle cx="54" cy="38" r="11" style={{ fill: 'var(--tree)' }} />
          <circle cx="79" cy="37" r="11" style={{ fill: 'var(--tree)' }} />
          <path d="M0 86 C70 66 150 74 210 88 C270 102 330 80 390 82 V110 H0Z" style={{ fill: 'var(--hill2)' }} />
          <path
            d="M130 110 C170 96 236 98 222 86 C210 76 252 68 300 60"
            style={{ stroke: 'var(--river)' }}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex gap-2 border-t border-verse-bd bg-verse-bar px-4 py-3">
          <button
            type="button"
            onClick={shareVerse}
            className="flex h-11 items-center gap-2 rounded-md px-2.5 font-sans text-sm font-medium"
          >
            <Share2 size={18} strokeWidth={1.5} aria-hidden="true" />
            Share
          </button>
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => {
              setSaved(!saved)
              toast(saved ? 'Removed from saved verses' : 'Verse saved')
            }}
            className="flex h-11 items-center gap-2 rounded-md px-2.5 font-sans text-sm font-medium"
          >
            <Bookmark size={18} strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
            {saved ? 'Saved' : 'Save'}
          </button>
          <a
            href="https://www.biblegateway.com/passage/?search=Psalm+1&version=NIV"
            target="_blank"
            rel="noreferrer"
            className="ml-auto flex h-11 items-center gap-1 whitespace-nowrap px-1.5 font-sans text-sm font-semibold text-verse-ink no-underline"
          >
            Read Psalm 1
            <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </section>

      <nav aria-label="Quick links" className="grid grid-cols-2 gap-2.5">
        {[
          { to: '/teachings', label: 'Teachings', icon: BookOpen, box: 'border-blue-bd bg-blue-bg', fg: 'text-blue-fg' },
          { to: '/give', label: 'Give', icon: Heart, box: 'border-clay-bd bg-clay-bg', fg: 'text-clay-fg' },
          { to: '/services', label: 'Services', icon: CalendarDays, box: 'border-clay-bd bg-clay-bg', fg: 'text-clay-fg' },
          { to: join.to, label: join.label, icon: UserPlus, box: 'border-olive-bd bg-olive-bg', fg: 'text-olive-fg' },
        ].map(({ to, label, icon: Icon, box, fg }) => (
          <Link
            key={label}
            to={to}
            className={cn('flex h-16 items-center gap-3 rounded-md border px-3.5 font-sans text-[15px] font-semibold text-ink no-underline', box)}
          >
            <span className={cn('flex size-9 items-center justify-center rounded-md bg-surface', fg)}>
              <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            </span>
            {label}
          </Link>
        ))}
      </nav>

      {featured && (
        <section aria-label="Featured event" className="flex flex-col gap-3">
          <SectionTitle>Coming up</SectionTitle>
          <article className="overflow-hidden rounded-md border border-line bg-surface">
            <Link
              to={`/events/${featured.id}`}
              aria-label={`${featured.title}, details`}
              className="relative block h-[150px] bg-[#2c4241]"
            >
              <EventArt height={150} />
              <span className="absolute left-3 top-3 flex w-14 flex-col items-center rounded-md bg-[#f4f4f5] py-1.5 text-[#18181b]">
                <span className="font-sans text-[10px] font-semibold leading-[14px] tracking-label">{eventMonth(featured)}</span>
                <span className="font-display text-xl font-semibold leading-6">{dayRange(featured)}</span>
              </span>
            </Link>
            <div className="flex flex-col gap-3 p-4">
              <span className="font-sans text-[11px] font-semibold leading-4 tracking-eyebrow text-clay-fg">{ministryLabel(featured.ministry)}</span>
              <h3 className="m-0 font-sans text-xl font-semibold leading-7">{featured.title}</h3>
              <p className="m-0 text-base leading-[26px] text-muted">{featured.blurb ?? featured.summary}</p>
              <div className="flex flex-col gap-2 font-sans text-sm leading-5">
                <Fact icon={CalendarDays}>{featured.when}</Fact>
                <Fact icon={MapPin}>{featured.where}</Fact>
                <Fact icon={Wallet}>{featured.cost} per person · transport included</Fact>
                <Fact icon={Users}>{goingLabel(featured, featuredCount, featuredGoing)}</Fact>
              </div>
              <div className="flex gap-2.5 pt-1">
                <Button
                  variant={featuredGoing ? 'ok' : 'primary'}
                  className="flex-1"
                  aria-pressed={featuredGoing}
                  onClick={() => EventsRepo.toggleRsvp(featured.id)}
                >
                  {featuredGoing ? "You're going" : 'RSVP'}
                </Button>
                <LinkButton to="/give?for=retreat" variant="secondary" className="flex-1">
                  Give towards it
                </LinkButton>
              </div>
            </div>
          </article>
        </section>
      )}

      <section aria-label="What's on" className="flex flex-col gap-3.5">
        <SectionTitle>What's on</SectionTitle>
        <ChipRow label="Filter by ministry">
          {FILTERS.map((f) => (
            <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </ChipRow>
        <div className="flex flex-col gap-2.5">
          {list.map((ev) => (
            <Link
              key={ev.id}
              to={`/events/${ev.id}`}
              className="flex items-center gap-3.5 rounded-md border border-line bg-surface p-3 text-ink no-underline"
            >
              <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-surface-2">
                <span className="font-sans text-[10px] font-semibold leading-[14px] tracking-label text-muted">{monthAbbr(ev.start)}</span>
                <span className="font-display text-[22px] font-semibold leading-[26px]">{dayOfMonth(ev.start)}</span>
              </div>
              <div className="flex min-w-0 grow flex-col gap-1">
                <span className="font-sans text-[15px] font-semibold leading-[21px]">{ev.title}</span>
                <span className="font-sans text-[13px] leading-[18px] text-muted">
                  {ev.when} · {ev.where}
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <Pill tone={MINISTRY_TONE[ev.ministry]}>{ev.ministry.toUpperCase()}</Pill>
                  <span className="font-sans text-xs font-medium text-muted">{ev.cost}</span>
                </div>
              </div>
              <ChevronRight size={18} strokeWidth={1.5} className="shrink-0 text-muted" aria-hidden="true" />
            </Link>
          ))}
          {list.length === 0 && (
            <div className="flex flex-col gap-1.5 rounded-md border border-dashed border-line-strong px-4 py-6 text-center">
              <span className="font-sans text-[15px] font-semibold">Nothing planned yet</span>
              <span className="text-[15px] leading-6 text-muted">
                We'll post here as soon as this ministry shares its next gathering.
              </span>
            </div>
          )}
        </div>
      </section>

      <section aria-label="Latest teaching" className="flex flex-col gap-3.5">
        <div className="flex items-baseline justify-between">
          <SectionTitle>Latest teaching</SectionTitle>
          <Link to="/teachings" className="font-sans text-sm font-semibold">
            Library
          </Link>
        </div>
        <Link
          to="/teachings"
          className="flex items-center gap-3.5 rounded-md border border-line bg-surface p-4 text-ink no-underline"
        >
          <span className="flex size-[72px] shrink-0 items-center justify-center rounded-md bg-clay-bg font-display text-xs font-semibold tracking-[0.06em] text-clay-fg">
            {latestTeaching.series.toUpperCase()}
          </span>
          <span className="flex min-w-0 grow flex-col gap-1">
            <span className="font-sans text-[11px] font-semibold leading-4 tracking-eyebrow text-clay-fg">
              {latestTeaching.series.toUpperCase()} · PART {latestTeaching.part}
            </span>
            <span className="font-sans text-[17px] font-semibold leading-6">{latestTeaching.title}</span>
            <span className="font-sans text-[13px] leading-[18px] text-muted">
              {latestTeaching.speaker} · {latestTeaching.date} · {latestTeaching.minutes} min
            </span>
          </span>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-inv text-on-inv">
            <Play size={18} fill="currentColor" aria-hidden="true" />
          </span>
        </Link>
      </section>

      <section aria-label="Last Sunday" className="flex flex-col gap-3.5">
        <SectionTitle>Last Sunday</SectionTitle>
        <Link to="/services" className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4 text-ink no-underline">
          <span className="font-sans text-[13px] font-medium text-muted">
            {shortDay(lastSunday.date)} · {lastSunday.title}
          </span>
          <span className="text-[19px] italic leading-7">“{lastSunday.theme}”</span>
          <span className="grid grid-cols-3 gap-2 border-t border-line">
            {[
              ['PREACHER', lastSunday.preacher],
              ['PRESENT', String(lastSunday.present)],
              ['ORDER', `${lastSunday.orderParts} parts`],
            ].map(([k, v]) => (
              <span key={k} className="flex flex-col gap-0.5 pt-3">
                <span className="font-sans text-[10px] font-semibold tracking-label text-muted">{k}</span>
                <span className="font-sans text-sm font-medium">{v}</span>
              </span>
            ))}
          </span>
        </Link>
      </section>
    </Screen>
  )
}

function Fact({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={18} strokeWidth={1.5} className="shrink-0 text-muted" aria-hidden="true" />
      {children}
    </div>
  )
}

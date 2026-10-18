import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { Button, IconLink } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { LockedCard } from '@/components/ui/LockedCard'
import { Pill } from '@/components/ui/Pill'
import type { Tone } from '@/components/ui/tone'
import { Eyebrow, PageTitle, SectionTitle } from '@/components/ui/Text'
import { attendance, DEMO_TODAY } from '@/data/seed'
import type { Member, MembershipStatus, Ministry } from '@/data/types'
import { parseDay, shortDay } from '@/lib/format'
import { cn } from '@/lib/utils'
import { EventsRepo } from '@/repos/events'
import { MembersRepo, useIsAdmin, useMembers } from '@/repos/members'

const TABS = [
  { id: 'members', label: 'Members' },
  { id: 'post', label: 'Post' },
  { id: 'attendance', label: 'Attendance' },
] as const
type Tab = (typeof TABS)[number]['id']

export default function Admin() {
  const isAdmin = useIsAdmin()
  const [tab, setTab] = useState<Tab>('members')

  if (!isAdmin) {
    return (
      <Screen>
        <IconLink to="/me" aria-label="Back to Me">
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </IconLink>
        <LockedCard eyebrow="CHURCH OFFICE" title="Admin only" body="This area is for the pastoral team and church office.">
          <Button className="mt-1 px-5" onClick={() => MembersRepo.setAdmin(true)}>
            Switch to admin (demo)
          </Button>
        </LockedCard>
      </Screen>
    )
  }

  return (
    <Screen className="gap-0 !px-0 !pt-0">
      <div className="sticky top-0 z-30 flex flex-col gap-3.5 border-b border-line bg-bg px-4 pb-3 pt-4">
        <div className="flex items-center gap-3">
          <IconLink to="/me" aria-label="Back">
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconLink>
          <div className="flex flex-col">
            <Eyebrow>CHURCH OFFICE</Eyebrow>
            <PageTitle className="!text-2xl !leading-[30px]">Admin</PageTitle>
          </div>
        </div>
        <div role="tablist" aria-label="Admin sections" className="grid grid-cols-3 rounded-full bg-surface-2 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="admin-panel"
              onClick={() => setTab(t.id)}
              className={cn(
                'h-[38px] rounded-full border-0 font-sans text-[13px] font-semibold',
                tab === t.id ? 'bg-surface text-ink' : 'bg-transparent text-muted',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div id="admin-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="flex flex-col gap-[18px] px-4 pb-8 pt-[18px]">
        {tab === 'members' && <MembersTab />}
        {tab === 'post' && <PostTab />}
        {tab === 'attendance' && <AttendanceTab />}
      </div>
    </Screen>
  )
}

const STATUS: Record<MembershipStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Pending', tone: 'warn' },
  call: { label: 'Call booked', tone: 'blue' },
  approved: { label: 'Approved', tone: 'ok' },
}

function sentLabel(iso: string) {
  const days = Math.round((parseDay(DEMO_TODAY).getTime() - parseDay(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'sent today'
  if (days === 1) return 'sent yesterday'
  if (days < 7) return `sent ${days} days ago`
  return days < 14 ? 'sent last week' : `sent ${Math.round(days / 7)} weeks ago`
}

function MembersTab() {
  const members = useMembers()
  const requests = useMemo(
    () => [...members].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
    [members],
  )
  const waiting = requests.filter((m) => m.status === 'pending').length

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-baseline justify-between">
        <SectionTitle>Join requests</SectionTitle>
        <span className="font-sans text-[13px] text-muted">{waiting} waiting</span>
      </div>
      {requests.map((m) => (
        <RequestCard key={m.id} member={m} />
      ))}
      {requests.length === 0 && (
        <div className="rounded-md border border-dashed border-line-strong px-4 py-6 text-center text-[15px] text-muted">
          No requests yet. New members will appear here.
        </div>
      )}
    </div>
  )
}

function RequestCard({ member }: { member: Member }) {
  const status = STATUS[member.status]
  const open = member.status === 'pending'
  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-3.5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-olive-bg font-display text-lg font-semibold text-olive-fg">
          {member.name[0]}
        </span>
        <span className="flex min-w-0 grow flex-col gap-0.5 font-sans">
          <span className="truncate text-[15px] font-semibold">{member.name}</span>
          <span className="text-xs text-muted">
            {member.area || 'Area not given'} · {sentLabel(member.requestedAt)}
          </span>
        </span>
        <Pill tone={status.tone} className="shrink-0">
          {status.label}
        </Pill>
      </div>
      <span className="font-sans text-[13px] leading-[19px] text-muted">
        Household of {member.household.length + 1} · {member.ministries.length ? member.ministries.join(', ') : 'No ministries picked'}
      </span>
      {open && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => MembersRepo.requestCall(member.id)}>
            Ask for a call
          </Button>
          <Button size="sm" onClick={() => MembersRepo.approve(member.id)}>
            Approve
          </Button>
        </div>
      )}
    </div>
  )
}

const MINISTRIES: Ministry[] = ['All church', 'Men', 'Women', 'Youth', 'Children']

function PostTab() {
  const [form, setForm] = useState({
    title: '',
    ministry: 'Youth' as Ministry,
    cost: 'Free',
    date: '2026-10-30',
    time: '18:30',
    where: 'Main Hall',
    details: '',
  })
  const [error, setError] = useState('')
  const [posted, setPosted] = useState<{ id: string; title: string; meta: string }[]>([])
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }))

  const publish = () => {
    if (!form.title.trim()) {
      setError('Give the announcement a title.')
      return
    }
    setError('')
    const event = EventsRepo.post(form)
    setPosted([
      { id: event.id, title: event.title, meta: `${shortDay(event.start)} · ${form.time} · ${event.where} · ${event.ministry}` },
      ...posted,
    ])
    setForm((f) => ({ ...f, title: '', details: '' }))
  }

  return (
    <div className="flex flex-col gap-3.5">
      <SectionTitle>Post an announcement</SectionTitle>
      <TextField
        label="What's happening"
        placeholder="e.g. Youth games night"
        value={form.title}
        error={error}
        onChange={(e) => set('title', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <SelectField label="Ministry" value={form.ministry} onChange={(e) => set('ministry', e.target.value as Ministry)}>
          {MINISTRIES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </SelectField>
        <TextField label="Cost" value={form.cost} onChange={(e) => set('cost', e.target.value)} className="min-w-0" />
        <TextField label="Date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className="min-w-0" />
        <TextField label="Time" type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className="min-w-0" />
      </div>
      <TextField label="Where" value={form.where} onChange={(e) => set('where', e.target.value)} />
      <TextAreaField
        label="Details and contact"
        rows={3}
        value={form.details}
        onChange={(e) => set('details', e.target.value)}
      />
      <Button size="lg" onClick={publish}>
        Publish to the feed
      </Button>
      {posted.map((p) => (
        <div key={p.id} role="status" className="flex flex-col gap-0.5 rounded-md bg-ok-bg p-3.5 font-sans">
          <span className="text-xs font-semibold tracking-label text-ok-fg">POSTED TO HOME</span>
          <span className="text-[15px] font-semibold">{p.title}</span>
          <span className="text-[13px]">{p.meta}</span>
          <Link to={`/events/${p.id}`} className="pt-1 text-[13px] font-semibold text-ok-fg">
            See it on Home
          </Link>
        </div>
      ))}
    </div>
  )
}

function AttendanceTab() {
  const counts = attendance.map((a) => a.count)
  const average = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length)
  const peak = attendance.reduce((best, a) => (a.count > best.count ? a : best))
  const august = attendance.filter((a) => a.date.startsWith('2026-08'))
  const later = attendance.filter((a) => !a.date.startsWith('2026-08'))
  const mean = (xs: typeof attendance) => xs.reduce((s, a) => s + a.count, 0) / xs.length
  const change = Math.round((mean(later) / mean(august) - 1) * 100)

  const min = 260
  const max = 420
  const x = (i: number) => 40 + i * 32
  const y = (v: number) => 20 + ((max - v) / (max - min)) * 120
  const last = attendance[attendance.length - 1]

  return (
    <div className="flex flex-col gap-3.5">
      <SectionTitle>Sunday attendance</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="AVERAGE" value={String(average)} />
        <Stat label="HIGHEST" value={String(peak.count)} />
        <Stat label="VS AUGUST" value={`${change >= 0 ? '+' : ''}${change}%`} tone={change >= 0 ? 'text-ok-fg' : 'text-bad-fg'} />
      </div>
      <figure className="m-0 flex flex-col gap-2.5 rounded-md border border-line bg-surface px-3 pb-3 pt-4">
        <svg
          viewBox="0 0 340 200"
          width="100%"
          height="200"
          role="img"
          aria-label={`Attendance over the last ${attendance.length} Sundays, from ${attendance[0].count} on ${shortDay(attendance[0].date)} to ${last.count} on ${shortDay(last.date)}, peaking at ${peak.count} on ${peak.note ?? 'the busiest Sunday'}, ${shortDay(peak.date)}`}
        >
          {[420, 340, 260].map((v) => (
            <g key={v}>
              <line x1="34" x2="334" y1={y(v)} y2={y(v)} style={{ stroke: 'var(--border)' }} strokeWidth="1" />
              <text x="0" y={y(v) + 4} style={{ fill: 'var(--muted)' }} fontFamily="Montserrat, sans-serif" fontSize="11">
                {v}
              </text>
            </g>
          ))}
          <polyline
            points={attendance.map((a, i) => `${x(i)},${y(a.count)}`).join(' ')}
            fill="none"
            style={{ stroke: 'var(--blue-fg)' }}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {attendance.map((a, i) => (
            <circle
              key={a.date}
              cx={x(i)}
              cy={y(a.count)}
              r={a === peak || a === last ? 5 : 3.5}
              style={{ fill: 'var(--surface)', stroke: 'var(--blue-fg)' }}
              strokeWidth="2"
            />
          ))}
          <text x="34" y="190" style={{ fill: 'var(--muted)' }} fontFamily="Montserrat, sans-serif" fontSize="11">
            {shortDay(attendance[0].date).slice(4)}
          </text>
          <text x="300" y="190" style={{ fill: 'var(--muted)' }} fontFamily="Montserrat, sans-serif" fontSize="11">
            {shortDay(last.date).slice(4)}
          </text>
          <text x={x(attendance.indexOf(peak)) - 56} y="12" style={{ fill: 'var(--text)' }} fontFamily="Montserrat, sans-serif" fontSize="11" fontWeight="600">
            {peak.count} {peak.note}
          </text>
        </svg>
        <figcaption className="font-sans text-xs text-muted">Main service, last {attendance.length} Sundays. Children counted separately.</figcaption>
      </figure>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-line bg-surface p-3 font-sans">
      <span className="text-[10px] font-semibold tracking-label text-muted">{label}</span>
      <span className={cn('font-display text-[22px] font-semibold', tone)}>{value}</span>
    </div>
  )
}

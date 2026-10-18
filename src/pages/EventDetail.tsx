import { Link, useParams } from 'react-router-dom'
import { CalendarDays, CalendarPlus, CheckCircle2, ChevronLeft, Heart, MapPin, Share2, User, Wallet } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { Button, IconButton, IconLink } from '@/components/ui/Button'
import { EventArt } from '@/components/ui/EventArt'
import { Eyebrow } from '@/components/ui/Text'
import { useToast } from '@/components/ui/toast-context'
import { RETREAT_APPEAL, RETREAT_PROGRAMME } from '@/data/seed'
import { downloadCalendar, ministryLabel } from '@/lib/events'
import { money, shortDay } from '@/lib/format'
import { EventsRepo, goingCount, useEvents, useRsvps } from '@/repos/events'
import { retreatRaised, useGifts } from '@/repos/giving'

export default function EventDetail() {
  const { id } = useParams()
  const toast = useToast()
  const events = useEvents()
  const rsvps = useRsvps()
  const gifts = useGifts()
  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <Screen>
        <IconLink to="/" aria-label="Back to home">
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </IconLink>
        <p className="text-muted">We couldn't find that event. It may have been removed.</p>
      </Screen>
    )
  }

  const going = rsvps.includes(event.id)
  const count = goingCount(event, rsvps)
  const isRetreat = event.id === 'mens-retreat'
  const raised = retreatRaised(gifts)
  const dates = event.end && event.end !== event.start ? `${shortDay(event.start)} to ${shortDay(event.end)}` : `${shortDay(event.start)} · ${event.when.split(' ').slice(1).join(' ')}`

  const share = async () => {
    const text = `${event.title}, ${dates}, ${event.where}`
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text })
        return
      } catch {
        // Cancelled
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      toast('Event details copied')
    } catch {
      toast('Sharing is not available on this device')
    }
  }

  const rsvp = () => {
    EventsRepo.toggleRsvp(event.id)
    toast(going ? 'RSVP cancelled' : "You're on the list")
  }

  return (
    <Screen className="gap-0 !px-0 !pt-0 pb-[104px]">
      <div className="relative h-[220px] bg-[#2c4241]">
        <EventArt height={220} width={390} />
        <div className="absolute inset-x-4 top-5 flex justify-between">
          <IconLink to="/" aria-label="Back to home">
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconLink>
          <IconButton aria-label="Share event" onClick={share}>
            <Share2 size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pt-5">
        <div className="flex flex-col gap-3">
          <Eyebrow className="text-clay-fg">{ministryLabel(event.ministry)}</Eyebrow>
          <h1 className="m-0 font-display text-[28px] font-medium leading-9 tracking-[0.02em]">{event.title}</h1>
          <p className="m-0 text-[17px] leading-7 text-muted">{event.summary}</p>
        </div>

        <div className="flex flex-col divide-y divide-line rounded-md border border-line bg-surface">
          <Row icon={CalendarDays} title={dates} sub={isRetreat ? 'Bus leaves church at 16:00 · back by 18:00 Sunday' : event.when} />
          <Row
            icon={MapPin}
            title={event.where}
            sub={
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.where)}`} target="_blank" rel="noreferrer">
                Open in maps
              </a>
            }
          />
          <Row
            icon={Wallet}
            title={event.cost === 'Free' ? 'Free' : `${event.cost} per person`}
            sub={isRetreat ? 'Transport, meals and shared rooms included' : event.cost === 'Free' ? 'No need to pay anything' : undefined}
          />
          {event.contact && <Row icon={User} title={event.contact} sub={<a href="tel:+260000000000">[Phone number]</a>} />}
        </div>

        {event.capacity && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-sans text-sm font-medium">
              <span>
                {count} of {event.capacity} places taken
              </span>
              {isRetreat && <span className="text-muted">RSVP by Sun 1 Nov</span>}
            </div>
            <div
              role="progressbar"
              aria-label="Places taken"
              aria-valuenow={count}
              aria-valuemin={0}
              aria-valuemax={event.capacity}
              className="h-2 overflow-hidden rounded-full bg-surface-2"
            >
              <div className="h-full rounded-full bg-clay-fg" style={{ width: `${Math.min(100, Math.round((count / event.capacity) * 100))}%` }} />
            </div>
          </div>
        )}

        {isRetreat && (
          <section aria-label="Programme" className="flex flex-col gap-3">
            <h2 className="m-0 font-display text-[22px] font-medium">Programme</h2>
            <div className="flex flex-col gap-2.5">
              {RETREAT_PROGRAMME.map((p) => (
                <div key={p.day} className="flex gap-3.5">
                  <span className="w-[92px] shrink-0 pt-1 font-sans text-[11px] font-semibold tracking-eyebrow text-clay-fg">{p.day}</span>
                  <span className="text-base leading-6">{p.plan}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {isRetreat && (
          <Link
            to="/give?for=retreat"
            className="flex flex-col gap-2.5 rounded-md border border-clay-bd bg-clay-bg p-4 text-ink no-underline"
          >
            <span className="flex items-center gap-2 font-sans text-base font-semibold">
              <Heart size={18} strokeWidth={1.5} className="text-clay-fg" aria-hidden="true" />
              Sponsor a brother
            </span>
            <span className="text-[15px] leading-6 text-muted">
              Help a man who can't afford the fee attend. {money(raised)} of {money(RETREAT_APPEAL.goal)} raised.
            </span>
            <span className="h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <span className="block h-full rounded-full bg-clay-fg" style={{ width: `${Math.min(100, Math.round((raised / RETREAT_APPEAL.goal) * 100))}%` }} />
            </span>
            <span className="font-sans text-sm font-semibold text-clay-fg">Give to the retreat fund</span>
          </Link>
        )}
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[480px] gap-2.5 border-t border-line bg-surface px-4 pb-[22px] pt-3">
        <IconButton
          aria-label="Add to calendar"
          className="size-14 rounded-md"
          onClick={() => {
            downloadCalendar(event)
            toast('Added to your calendar')
          }}
        >
          <CalendarPlus size={22} strokeWidth={1.5} aria-hidden="true" />
        </IconButton>
        <Button variant={going ? 'ok' : 'primary'} size="lg" className="flex-1" aria-pressed={going} onClick={rsvp}>
          {going ? (
            <>
              <CheckCircle2 size={18} aria-hidden="true" />
              You're going · Cancel
            </>
          ) : (
            "RSVP · I'm going"
          )}
        </Button>
      </div>
    </Screen>
  )
}

function Row({ icon: Icon, title, sub }: { icon: typeof MapPin; title: string; sub?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5 p-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-2 text-muted">
        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5 pt-0.5 font-sans">
        <span className="text-[15px] font-semibold leading-[22px]">{title}</span>
        {sub && <span className="text-[13px] leading-5 text-muted">{sub}</span>}
      </div>
    </div>
  )
}

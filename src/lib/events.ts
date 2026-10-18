import type { ChurchEvent, Ministry } from '@/data/types'
import type { Tone } from '@/components/ui/tone'
import { dayOfMonth, monthAbbr } from './format'

export const MINISTRY_TONE: Record<Ministry, Tone> = {
  'All church': 'surface',
  Youth: 'blue',
  Women: 'rose',
  Children: 'sand',
  Men: 'clay',
}

const MINISTRY_LABEL: Record<Ministry, string> = {
  'All church': 'ALL CHURCH',
  Men: "MEN'S MINISTRY",
  Women: "WOMEN'S MINISTRY",
  Youth: 'YOUTH MINISTRY',
  Children: "CHILDREN'S MINISTRY",
}

export const ministryLabel = (m: Ministry) => MINISTRY_LABEL[m]

/** "6–8" for multi-day events, "23" for single days. */
export function dayRange(event: ChurchEvent) {
  const first = Number(dayOfMonth(event.start))
  if (!event.end || event.end === event.start) return String(first).padStart(2, '0')
  return `${first}–${Number(dayOfMonth(event.end))}`
}

export const eventMonth = (event: ChurchEvent) => monthAbbr(event.start)

export function goingLabel(event: ChurchEvent, count: number, going: boolean) {
  if (going) {
    const others = count - 1
    return others > 0 ? `You and ${others} ${others === 1 ? 'other' : 'others'} are going` : "You're going"
  }
  const who = event.ministry === 'Men' ? ' men' : ''
  if (event.capacity) return `${count}${who} going · ${Math.max(event.capacity - count, 0)} places left`
  return `${count}${who} going`
}

/** Downloads an all-day .ics file so the event lands in the phone's calendar app. */
export function downloadCalendar(event: ChurchEvent) {
  const compact = (iso: string) => iso.replaceAll('-', '')
  const last = new Date(`${event.end ?? event.start}T00:00:00`)
  last.setDate(last.getDate() + 1)
  const exclusiveEnd = last.toISOString().slice(0, 10)
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Riverine Community Church//Demo//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@riverine.demo`,
    `DTSTAMP:${compact(event.start)}T000000Z`,
    `DTSTART;VALUE=DATE:${compact(event.start)}`,
    `DTEND;VALUE=DATE:${compact(exclusiveEnd)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.where}`,
    `DESCRIPTION:${event.summary.replaceAll('\n', ' ')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

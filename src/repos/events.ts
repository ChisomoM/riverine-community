import { getState, update, useDemo } from '@/data/store'
import type { ChurchEvent, Ministry } from '@/data/types'
import { weekday } from '@/lib/format'

export interface NewAnnouncement {
  title: string
  ministry: Ministry
  cost: string
  /** ISO date */
  date: string
  time: string
  where: string
  details: string
}

export const EventsRepo = {
  list(): ChurchEvent[] {
    return [...getState().events].sort((a, b) => a.start.localeCompare(b.start))
  },

  get(id: string): ChurchEvent | undefined {
    return getState().events.find((e) => e.id === id)
  },

  /** Writes an announcement to the shared feed and returns it. */
  post(input: NewAnnouncement): ChurchEvent {
    const event: ChurchEvent = {
      id: `ev-${Date.now()}`,
      title: input.title.trim(),
      ministry: input.ministry,
      start: input.date,
      when: `${weekday(input.date)} ${input.time}`,
      where: input.where.trim() || 'Main Hall',
      cost: input.cost.trim() || 'Free',
      summary: input.details.trim(),
      going: 0,
    }
    update((s) => ({ ...s, events: [...s.events, event] }))
    return event
  },

  toggleRsvp(id: string) {
    update((s) => ({
      ...s,
      rsvps: s.rsvps.includes(id) ? s.rsvps.filter((r) => r !== id) : [...s.rsvps, id],
    }))
  },
}

export const useEvents = () => useDemo((s) => s.events)
export const useRsvps = () => useDemo((s) => s.rsvps)

export const goingCount = (event: ChurchEvent, rsvps: string[]) => event.going + (rsvps.includes(event.id) ? 1 : 0)

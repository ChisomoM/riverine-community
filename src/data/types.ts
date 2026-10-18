export type Ministry = 'All church' | 'Men' | 'Women' | 'Youth' | 'Children'

export interface ChurchEvent {
  id: string
  title: string
  ministry: Ministry
  /** ISO date of the first day, e.g. 2026-11-06 */
  start: string
  /** ISO date of the last day, omitted for single-day events */
  end?: string
  /** Time of day shown in lists, e.g. "Fri 18:30" or "Fri to Sun" */
  when: string
  where: string
  /** Cost label, e.g. "Free" or "K850" */
  cost: string
  /** One line used on cards */
  blurb?: string
  summary: string
  contact?: string
  /** Number of places, when the event is capped */
  capacity?: number
  /** People going before the current member RSVPs */
  going: number
  featured?: boolean
}

export type MembershipStatus = 'pending' | 'call' | 'approved'

export interface HouseholdMember {
  name: string
  relation: string
}

export interface Member {
  id: string
  name: string
  phone: string
  email: string
  area: string
  since: string
  household: HouseholdMember[]
  ministries: string[]
  status: MembershipStatus
  /** ISO date the request was sent */
  requestedAt: string
}

export interface JoinDraft {
  step: number
  name: string
  phone: string
  email: string
  area: string
  since: string
  household: HouseholdMember[]
  ministries: string[]
  agree: boolean
}

export type GiftCategory = 'tithe' | 'offering' | 'building' | 'retreat'
export type Network = 'mtn' | 'airtel'
export type GiftStatus = 'paid' | 'failed'

export interface Gift {
  id: string
  /** ISO date */
  date: string
  category: GiftCategory
  amount: number
  network: Network
  status: GiftStatus
  /** Receipt number, set on paid gifts */
  receipt?: string
  /** Transaction id from the mobile money network */
  txn?: string
}

export interface AttendancePoint {
  date: string
  count: number
  note?: string
}

export interface Settings {
  theme: 'light' | 'dark'
  largeText: boolean
}

export interface DemoState {
  members: Member[]
  currentMemberId: string | null
  isAdmin: boolean
  events: ChurchEvent[]
  rsvps: string[]
  gifts: Gift[]
  draft: JoinDraft | null
  settings: Settings
  /** Receipt counter so every simulated gift gets a new number */
  receiptSeq: number
}

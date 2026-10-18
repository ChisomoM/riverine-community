import type { AttendancePoint, ChurchEvent, DemoState, Gift, Member } from './types'

/** The demo runs on a fixed Sunday so the seed data stays believable. */
export const DEMO_TODAY = '2026-10-18'

export const CURRENT_MEMBER_ID = 'm-chisomo'

/** Raised before any gift made inside the demo; the appeal total adds retreat gifts on top. */
export const RETREAT_APPEAL = { base: 12150, goal: 20000 }

export const MINISTRY_OPTIONS = [
  "Men's ministry",
  "Women's ministry",
  'Youth',
  "Children's church",
  'Worship team',
  'Ushering',
  'Media team',
  'Prayer',
  'Outreach',
]

export const RETREAT_PROGRAMME = [
  { day: 'FRIDAY', plan: 'Arrive, dinner and evening worship' },
  { day: 'SATURDAY', plan: 'Teaching sessions, fishing, fireside prayer' },
  { day: 'SUNDAY', plan: 'Lakeside communion, travel home' },
]

const events: ChurchEvent[] = [
  {
    id: 'mens-retreat',
    title: "Rooted: Men's Retreat 2026",
    ministry: 'Men',
    start: '2026-11-06',
    end: '2026-11-08',
    when: 'Fri 6 Nov, 16:00 to Sun 8 Nov, 13:00',
    where: '[Venue], Siavonga',
    cost: 'K850',
    blurb: 'Three days by the lake to rest, pray and grow together as brothers.',
    summary:
      'Three days by the lake to rest, pray and grow together as brothers. Open to every man in the church family, members or not.',
    contact: 'Brother [Name], men’s ministry',
    capacity: 60,
    going: 38,
    featured: true,
  },
  {
    id: 'midweek-prayer',
    title: 'Mid-week prayer',
    ministry: 'All church',
    start: '2026-10-21',
    when: 'Wed 18:00',
    where: 'Prayer Room',
    cost: 'Free',
    summary: 'An hour of prayer for the church, our city and the week ahead.',
    going: 46,
  },
  {
    id: 'youth-worship',
    title: 'Youth worship night',
    ministry: 'Youth',
    start: '2026-10-23',
    when: 'Fri 18:30',
    where: 'Main Hall',
    cost: 'Free',
    summary: 'Live worship, a short message and snacks for every teenager and young adult.',
    going: 74,
  },
  {
    id: 'womens-breakfast',
    title: "Women's fellowship breakfast",
    ministry: 'Women',
    start: '2026-10-24',
    when: 'Sat 08:00',
    where: 'Fellowship Hall',
    cost: 'K100',
    summary: 'Breakfast, testimonies and prayer together. Bring a friend.',
    capacity: 80,
    going: 52,
  },
  {
    id: 'kids-harvest',
    title: 'Kids harvest fun day',
    ministry: 'Children',
    start: '2026-10-31',
    when: 'Sat 10:00',
    where: 'Church grounds',
    cost: 'Free',
    summary: 'Games, a harvest story and lunch for children aged 3 to 12.',
    going: 63,
  },
]

const members: Member[] = [
  {
    id: CURRENT_MEMBER_ID,
    name: 'Chisomo Mutale',
    phone: '097 123 4567',
    email: '',
    area: 'Kabulonga',
    since: '3 to 12 months',
    household: [{ name: 'Mulenga Mutale', relation: 'Sibling' }],
    ministries: ["Men's ministry", 'Media team'],
    status: 'approved',
    requestedAt: '2026-10-04',
  },
  {
    id: 'm-mwansa',
    name: 'Mwansa Phiri',
    phone: '096 555 0142',
    email: '',
    area: 'Chelstone',
    since: 'Less than 3 months',
    household: [
      { name: 'Chanda Phiri', relation: 'Spouse' },
      { name: 'Temwa Phiri', relation: 'Child' },
      { name: 'Luyando Phiri', relation: 'Child' },
    ],
    ministries: ["Women's ministry", "Children's church"],
    status: 'pending',
    requestedAt: '2026-10-15',
  },
  {
    id: 'm-joseph',
    name: 'Joseph Tembo',
    phone: '095 888 0199',
    email: '',
    area: 'Woodlands',
    since: '1 to 3 years',
    household: [],
    ministries: ['Youth', 'Worship team'],
    status: 'pending',
    requestedAt: '2026-10-11',
  },
]

/** 24 paid gifts totalling K6,850 plus one failed attempt, January to October. */
function gift(
  id: string,
  date: string,
  category: Gift['category'],
  amount: number,
  network: Gift['network'] = 'mtn',
  status: Gift['status'] = 'paid',
): Gift {
  const paid = status === 'paid'
  return {
    id,
    date,
    category,
    amount,
    network,
    status,
    receipt: paid ? `RCC-${date.slice(0, 4)}-${date.slice(5, 7)}-${id.slice(1).padStart(4, '0')}` : undefined,
    txn: paid ? `MP${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}.${id.slice(1)}` : undefined,
  }
}

const gifts: Gift[] = [
  gift('g24', '2026-10-18', 'tithe', 500),
  gift('g23', '2026-10-04', 'offering', 100),
  gift('g22', '2026-10-02', 'building', 200, 'airtel'),
  gift('g21f', '2026-10-02', 'building', 200, 'airtel', 'failed'),
  gift('g20', '2026-09-27', 'tithe', 500),
  gift('g19', '2026-09-20', 'retreat', 250),
  gift('g18', '2026-09-06', 'offering', 150),
  gift('g17', '2026-08-30', 'tithe', 500),
  gift('g16', '2026-08-16', 'offering', 100, 'airtel'),
  gift('g15', '2026-07-26', 'tithe', 500),
  gift('g14', '2026-07-12', 'offering', 100),
  gift('g13', '2026-06-28', 'tithe', 500),
  gift('g12', '2026-06-14', 'building', 150),
  gift('g11', '2026-05-31', 'tithe', 500),
  gift('g10', '2026-05-10', 'offering', 100),
  gift('g9', '2026-04-26', 'tithe', 500),
  gift('g8', '2026-04-05', 'offering', 100),
  gift('g7', '2026-03-29', 'tithe', 500),
  gift('g6', '2026-03-15', 'building', 150),
  gift('g5', '2026-02-22', 'tithe', 500),
  gift('g4', '2026-02-08', 'offering', 100),
  gift('g3', '2026-01-25', 'tithe', 500),
  gift('g2', '2026-01-11', 'offering', 100),
  gift('g1', '2026-01-04', 'building', 150),
  gift('g0', '2026-01-04', 'offering', 100),
]

export const attendance: AttendancePoint[] = [
  { date: '2026-08-02', count: 289 },
  { date: '2026-08-09', count: 305 },
  { date: '2026-08-16', count: 312 },
  { date: '2026-08-30', count: 298 },
  { date: '2026-09-06', count: 327 },
  { date: '2026-09-13', count: 330 },
  { date: '2026-09-20', count: 401, note: 'Guest Sunday' },
  { date: '2026-09-27', count: 355 },
  { date: '2026-10-04', count: 318 },
  { date: '2026-10-11', count: 342 },
]

/** Read-only content for the Home cards that point at the Teachings and Services tabs. */
export const lastSunday = {
  date: '2026-10-11',
  title: 'Sunday Worship',
  theme: 'Rooted, not rushed: finding strength in the dry season.',
  preacher: 'Pastor [Name]',
  present: 342,
  orderParts: 7,
}

export const latestTeaching = {
  series: 'Planted',
  part: 3,
  title: 'Roots before fruit',
  speaker: 'Pastor [Name]',
  date: '11 Oct',
  minutes: 42,
}

export const verseOfTheDay = {
  text: 'That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither.',
  ref: 'Psalm 1:3 (NIV)',
}

export function createSeed(): DemoState {
  return {
    members: structuredClone(members),
    currentMemberId: CURRENT_MEMBER_ID,
    isAdmin: false,
    events: structuredClone(events),
    rsvps: ['midweek-prayer'],
    gifts: structuredClone(gifts),
    draft: null,
    settings: { theme: 'light', largeText: false },
    receiptSeq: 187,
  }
}

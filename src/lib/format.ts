const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** Parses an ISO date (YYYY-MM-DD) as a local date so the weekday never shifts with the time zone. */
export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const money = (n: number) => 'K' + n.toLocaleString('en-US')

/** "Sun 18 Oct" */
export function shortDay(iso: string) {
  const d = parseDay(iso)
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** "18 Oct 2026" */
export function fullDay(iso: string) {
  const d = parseDay(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** "OCTOBER 2026" */
export function monthHeading(iso: string) {
  const d = parseDay(iso)
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`.toUpperCase()
}

/** "SUNDAY · 18 OCTOBER" */
export function greetingDate(iso: string) {
  const d = parseDay(iso)
  const day = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][d.getDay()]
  return `${day} · ${d.getDate()} ${MONTHS_LONG[d.getMonth()].toUpperCase()}`
}

export const monthAbbr = (iso: string) => MONTHS[parseDay(iso).getMonth()].toUpperCase()
export const dayOfMonth = (iso: string) => String(parseDay(iso).getDate()).padStart(2, '0')
export const weekday = (iso: string) => WEEKDAYS[parseDay(iso).getDay()]
export const monthOnly = (iso: string) => MONTHS_LONG[parseDay(iso).getMonth()]

export const firstName = (name: string) => name.trim().split(/\s+/)[0] || ''

/** Keeps the first digits visible, hides the middle: 097 ••• 4567 */
export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return `${digits.slice(0, 3)}•••${digits.slice(-4)}`
}

export const isValidName = (name: string) => name.trim().split(/\s+/).length >= 2
export const isValidPhone = (phone: string) => phone.replace(/\D/g, '').length === 10

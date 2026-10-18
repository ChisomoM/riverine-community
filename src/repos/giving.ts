import { DEMO_TODAY, RETREAT_APPEAL } from '@/data/seed'
import { getState, update, useDemo } from '@/data/store'
import type { Gift, GiftCategory, Network } from '@/data/types'

export const CATEGORIES: { id: GiftCategory; label: string; hint: string }[] = [
  { id: 'tithe', label: 'Tithe', hint: 'A tenth, given monthly' },
  { id: 'offering', label: 'Offering', hint: 'Sunday and thank offerings' },
  { id: 'building', label: 'Building fund', hint: 'New sanctuary roof' },
  { id: 'retreat', label: "Men's retreat", hint: 'Sponsor a brother' },
]

export const NETWORKS: { id: Network; label: string }[] = [
  { id: 'mtn', label: 'MTN MoMo' },
  { id: 'airtel', label: 'Airtel Money' },
]

export const categoryLabel = (id: GiftCategory) => CATEGORIES.find((c) => c.id === id)!.label
export const networkLabel = (id: Network) => NETWORKS.find((n) => n.id === id)!.label

export interface GiftAttempt {
  category: GiftCategory
  amount: number
  network: Network
  succeeded: boolean
}

export const GivingRepo = {
  /** Records the outcome of a simulated mobile money payment. */
  record(attempt: GiftAttempt): Gift {
    const s = getState()
    const seq = s.receiptSeq + 1
    const padded = String(seq).padStart(4, '0')
    const [y, m, d] = DEMO_TODAY.split('-')
    const gift: Gift = {
      id: `g${seq}${attempt.succeeded ? '' : 'f'}`,
      date: DEMO_TODAY,
      category: attempt.category,
      amount: attempt.amount,
      network: attempt.network,
      status: attempt.succeeded ? 'paid' : 'failed',
      receipt: attempt.succeeded ? `RCC-${y}-${m}-${padded}` : undefined,
      txn: attempt.succeeded ? `MP${y.slice(2)}${m}${d}.1042.A${seq % 100}` : undefined,
    }
    update((st) => ({ ...st, receiptSeq: seq, gifts: [gift, ...st.gifts] }))
    return gift
  },
}

export const useGifts = () => useDemo((s) => s.gifts)

export function summarise(gifts: Gift[]) {
  const paid = gifts.filter((g) => g.status === 'paid')
  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    total: paid.filter((g) => g.category === c.id).reduce((sum, g) => sum + g.amount, 0),
  }))
  const total = byCategory.reduce((sum, c) => sum + c.total, 0)
  return { count: paid.length, total, byCategory }
}

export const retreatRaised = (gifts: Gift[]) =>
  RETREAT_APPEAL.base + gifts.filter((g) => g.category === 'retreat' && g.status === 'paid').reduce((s, g) => s + g.amount, 0)

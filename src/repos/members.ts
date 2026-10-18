import { CURRENT_MEMBER_ID, DEMO_TODAY, createSeed } from '@/data/seed'
import { getState, update, useDemo } from '@/data/store'
import type { JoinDraft, Member } from '@/data/types'

export type Access = 'visitor' | 'pending' | 'member'

export const emptyDraft = (): JoinDraft => ({
  step: 1,
  name: '',
  phone: '',
  email: '',
  area: '',
  since: 'Less than 3 months',
  household: [],
  ministries: [],
  agree: true,
})

export function accessOf(member: Member | undefined): Access {
  if (!member) return 'visitor'
  return member.status === 'approved' ? 'member' : 'pending'
}

export const MembersRepo = {
  current(): Member | undefined {
    const s = getState()
    return s.members.find((m) => m.id === s.currentMemberId)
  },

  /** Everyone who has sent a request, newest first. The signed-in member only shows while their request is open. */
  requests(): Member[] {
    return [...getState().members].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
  },

  saveDraft(draft: JoinDraft) {
    update((s) => ({ ...s, draft }))
  },

  /** Sends a new request, or saves edits when the person is already a member. */
  submitJoin(draft: JoinDraft): Member {
    const existing = MembersRepo.current()
    const member: Member = {
      id: existing?.id ?? `m-${Date.now()}`,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      area: draft.area.trim(),
      since: draft.since,
      household: draft.household,
      ministries: draft.ministries,
      status: existing?.status ?? 'pending',
      requestedAt: existing?.requestedAt ?? DEMO_TODAY,
    }
    update((s) => ({
      ...s,
      draft: null,
      currentMemberId: member.id,
      members: existing ? s.members.map((m) => (m.id === member.id ? member : m)) : [member, ...s.members],
    }))
    return member
  },

  approve(id: string) {
    update((s) => ({ ...s, members: s.members.map((m) => (m.id === id ? { ...m, status: 'approved' } : m)) }))
  },

  requestCall(id: string) {
    update((s) => ({ ...s, members: s.members.map((m) => (m.id === id ? { ...m, status: 'call' } : m)) }))
  },

  /** Demo tool: jump to a membership state without going through the whole flow. */
  viewAs(access: Access) {
    update((s) => {
      if (access === 'visitor') {
        return { ...s, members: s.members.filter((m) => m.id !== s.currentMemberId), currentMemberId: null }
      }
      const sample = createSeed().members.find((m) => m.id === CURRENT_MEMBER_ID)!
      const own = s.members.find((m) => m.id === s.currentMemberId) ?? sample
      const next: Member = { ...own, status: access === 'member' ? 'approved' : 'pending' }
      return {
        ...s,
        currentMemberId: next.id,
        members: s.members.some((m) => m.id === next.id)
          ? s.members.map((m) => (m.id === next.id ? next : m))
          : [next, ...s.members],
      }
    })
  },

  setAdmin(isAdmin: boolean) {
    update((s) => ({ ...s, isAdmin }))
  },
}

export const useMembers = () => useDemo((s) => s.members)
export const useCurrentMemberId = () => useDemo((s) => s.currentMemberId)
export const useIsAdmin = () => useDemo((s) => s.isAdmin)
export const useDraft = () => useDemo((s) => s.draft)

export function useCurrentMember(): Member | undefined {
  const members = useMembers()
  const id = useCurrentMemberId()
  return members.find((m) => m.id === id)
}

export function useAccess(): Access {
  return accessOf(useCurrentMember())
}

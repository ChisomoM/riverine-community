import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CheckCircle2, ChevronLeft, Plus, Trash2, UserPlus } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { Button, IconButton, LinkButton } from '@/components/ui/Button'
import { SelectField, TextField } from '@/components/ui/Field'
import { Eyebrow, PageTitle } from '@/components/ui/Text'
import { useToast } from '@/components/ui/toast-context'
import { MINISTRY_OPTIONS } from '@/data/seed'
import type { HouseholdMember, JoinDraft } from '@/data/types'
import { firstName, isValidName, isValidPhone } from '@/lib/format'
import { cn } from '@/lib/utils'
import { emptyDraft, MembersRepo, useCurrentMember, useDraft } from '@/repos/members'

const SINCE = ['Less than 3 months', '3 to 12 months', '1 to 3 years', 'More than 3 years']
const RELATIONS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other']

export default function Join() {
  const navigate = useNavigate()
  const toast = useToast()
  const member = useCurrentMember()
  const savedDraft = useDraft()

  // An approved member is editing details; a pending member sees their request; anyone else fills the form.
  const editing = member?.status === 'approved'
  const [form, setForm] = useState<JoinDraft>(() => {
    if (member) return { ...emptyDraft(), ...member, step: 1, agree: true }
    return savedDraft ?? emptyDraft()
  })
  const [sent, setSent] = useState(() => !!member && !editing)
  const [tried, setTried] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRelation, setNewRelation] = useState(RELATIONS[0])
  const resumed = useRef(!member && !!savedDraft && savedDraft.step > 1)

  useEffect(() => {
    if (resumed.current) {
      toast('Picked up where you left off')
      resumed.current = false
    }
  }, [toast])

  const patch = (next: Partial<JoinDraft>) => {
    const merged = { ...form, ...next }
    setForm(merged)
    if (!member) MembersRepo.saveDraft(merged)
  }

  const go = (step: number) => {
    setTried(false)
    patch({ step })
  }

  const nameError = tried && form.step === 1 && !isValidName(form.name) ? 'Please enter your full name.' : ''
  const phoneError =
    tried && form.step === 1 && !isValidPhone(form.phone) ? 'Enter a 10-digit Zambian number, like 097 123 4567.' : ''

  const next = () => {
    if (form.step === 1 && !(isValidName(form.name) && isValidPhone(form.phone))) {
      setTried(true)
      return
    }
    if (form.step === 4) {
      if (!form.agree) return
      MembersRepo.submitJoin(form)
      if (editing) {
        toast('Details saved')
        navigate('/me')
      } else {
        setSent(true)
      }
      return
    }
    go(form.step + 1)
  }

  const addHousehold = () => {
    if (!newName.trim()) return
    const person: HouseholdMember = { name: newName.trim(), relation: newRelation }
    patch({ household: [...form.household, person] })
    setNewName('')
    setAdding(false)
  }

  const toggleMinistry = (m: string) =>
    patch({ ministries: form.ministries.includes(m) ? form.ministries.filter((x) => x !== m) : [...form.ministries, m] })

  if (sent) {
    const status = member?.status
    return (
      <Screen className="justify-between">
        <div className="flex flex-col items-center gap-3 pt-10 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-olive-bg text-olive-fg">
            <UserPlus size={36} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <Eyebrow className="text-olive-fg">PENDING APPROVAL</Eyebrow>
          <PageTitle>Welcome to the family</PageTitle>
          <p className="m-0 text-[17px] leading-7 text-muted">
            We've received your request, {firstName(form.name) || 'friend'}. The pastoral team usually replies within a week.
          </p>
        </div>
        <ol className="m-0 flex list-none flex-col gap-0 rounded-md border border-line bg-surface p-4">
          <Milestone done title="Request sent" sub="Today" />
          <Milestone
            done={status === 'call'}
            title={status === 'call' ? 'Call booked' : 'Pastoral team review'}
            sub={status === 'call' ? 'The team will phone you this week' : 'In progress'}
          />
          <Milestone title="New members class" sub="Next one: Sun 15 Nov, 13:00" last />
        </ol>
        <div className="flex flex-col gap-2.5">
          <LinkButton to="/" size="lg">
            Back to home
          </LinkButton>
          <Button
            variant="secondary"
            onClick={() => {
              MembersRepo.setAdmin(true)
              navigate('/admin')
            }}
            className="border-dashed font-sans text-xs tracking-label text-muted"
          >
            DEMO · OPEN ADMIN TO APPROVE
          </Button>
        </div>
      </Screen>
    )
  }

  const review = [
    {
      title: 'ABOUT YOU',
      step: 1,
      body: [form.name, form.phone, form.email, `${form.area} · attending ${form.since.toLowerCase()}`].filter(Boolean),
    },
    {
      title: 'HOUSEHOLD',
      step: 2,
      body: form.household.length ? form.household.map((h) => `${h.name} (${h.relation})`) : ['Just me'],
    },
    { title: 'MINISTRIES', step: 3, body: [form.ministries.length ? form.ministries.join(', ') : 'None yet'] },
  ]

  return (
    <Screen className="gap-0 !px-0 !pt-0">
      <div className="flex flex-col gap-3.5 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <IconButton
            aria-label={form.step === 1 ? 'Leave' : 'Previous step'}
            onClick={() => (form.step > 1 ? go(form.step - 1) : navigate(-1))}
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
          {!editing && (
            <span className="flex items-center gap-1.5 font-sans text-xs font-medium text-muted">
              <CheckCircle2 size={16} strokeWidth={1.5} aria-hidden="true" />
              Draft saved
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Eyebrow className="text-olive-fg">
            {editing ? 'EDIT YOUR DETAILS' : 'BECOME A MEMBER'} · STEP {form.step} OF 4
          </Eyebrow>
          <div className="grid grid-cols-4 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={cn('h-1 rounded-full', i <= form.step ? 'bg-olive-fg' : 'bg-line-strong')} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-4 pb-32 pt-3">
        {form.step === 1 && (
          <>
            <Heading title="About you" body="We're glad you want to call Riverine home. This takes about three minutes." />
            <TextField
              label="Full name"
              autoComplete="name"
              value={form.name}
              error={nameError}
              onChange={(e) => patch({ name: e.target.value })}
            />
            <TextField
              label="Phone number"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              error={phoneError}
              onChange={(e) => patch({ phone: e.target.value })}
            />
            <TextField
              label={
                <>
                  Email <span className="font-normal text-muted">(optional)</span>
                </>
              }
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
            <TextField label="Area you live in" value={form.area} onChange={(e) => patch({ area: e.target.value })} />
            <SelectField label="How long have you attended?" value={form.since} onChange={(e) => patch({ since: e.target.value })}>
              {SINCE.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </SelectField>
          </>
        )}

        {form.step === 2 && (
          <>
            <Heading
              title="Your household"
              body="Add the people who live with you and come to church. Children are added to kids' church automatically."
            />
            <div className="flex flex-col gap-2.5">
              <Person initial={form.name.trim()[0] ?? '?'} name={form.name || 'You'} sub="You · main contact" />
              {form.household.map((h, i) => (
                <Person
                  key={`${h.name}-${i}`}
                  initial={h.name[0]}
                  name={h.name}
                  sub={h.relation}
                  onRemove={() => patch({ household: form.household.filter((_, j) => j !== i) })}
                />
              ))}
              {adding ? (
                <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-3.5">
                  <TextField label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                  <SelectField label="Relationship" value={newRelation} onChange={(e) => setNewRelation(e.target.value)}>
                    {RELATIONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </SelectField>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setAdding(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" disabled={!newName.trim()} onClick={addHousehold}>
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="flex h-14 items-center justify-center gap-2 rounded-md border border-dashed border-line-strong bg-transparent font-sans text-[15px] font-semibold text-ink"
                >
                  <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
                  Add a household member
                </button>
              )}
            </div>
          </>
        )}

        {form.step === 3 && (
          <>
            <Heading title="Where you'd like to grow" body="Pick any ministries you'd like to hear from. You can change this later." />
            <div role="group" aria-label="Ministries" className="flex flex-wrap gap-2.5">
              {MINISTRY_OPTIONS.map((m) => {
                const on = form.ministries.includes(m)
                return (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleMinistry(m)}
                    className={cn(
                      'flex h-11 items-center gap-1.5 rounded-full border px-4 font-sans text-sm font-medium',
                      on ? 'border-olive-fg bg-olive-bg text-olive-fg' : 'border-line-strong bg-surface text-ink',
                    )}
                  >
                    {on && <Check size={16} strokeWidth={2} aria-hidden="true" />}
                    {m}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {form.step === 4 && (
          <>
            <Heading
              title="Check and send"
              body={editing ? 'Review your changes before saving.' : 'The pastoral team will review your request.'}
            />
            {review.map((r) => (
              <div key={r.title} className="flex flex-col gap-2 rounded-md border border-line bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[11px] font-semibold tracking-eyebrow text-muted">{r.title}</span>
                  <button
                    type="button"
                    onClick={() => go(r.step)}
                    className="h-11 bg-transparent px-1 font-sans text-sm font-semibold text-link underline"
                  >
                    Edit<span className="sr-only"> {r.title.toLowerCase()}</span>
                  </button>
                </div>
                <div className="flex flex-col text-base leading-6">
                  {r.body.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              role="checkbox"
              aria-checked={form.agree}
              onClick={() => patch({ agree: !form.agree })}
              className="flex items-start gap-3 bg-transparent p-0 text-left"
            >
              <span
                className={cn(
                  'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-ink',
                  form.agree ? 'bg-ink text-bg' : 'bg-transparent',
                )}
              >
                {form.agree && <Check size={16} strokeWidth={2.5} aria-hidden="true" />}
              </span>
              <span className="text-[15px] leading-6">
                I'm happy for the church to keep these details and contact me about membership.
              </span>
            </button>
          </>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-line bg-bg px-4 pb-[22px] pt-3">
        <Button size="lg" className="w-full" disabled={form.step === 4 && !form.agree} onClick={next}>
          {form.step === 4 ? (editing ? 'Save changes' : 'Send my request') : 'Continue'}
        </Button>
      </div>
    </Screen>
  )
}

function Heading({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <PageTitle>{title}</PageTitle>
      <p className="m-0 text-[17px] leading-7 text-muted">{body}</p>
    </div>
  )
}

function Person({ initial, name, sub, onRemove }: { initial: string; name: string; sub: string; onRemove?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-olive-bg font-display text-lg font-semibold text-olive-fg">
        {initial.toUpperCase()}
      </span>
      <span className="flex min-w-0 grow flex-col font-sans">
        <span className="truncate text-[15px] font-semibold">{name}</span>
        <span className="text-[13px] text-muted">{sub}</span>
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="flex size-11 items-center justify-center rounded-full bg-transparent text-muted"
        >
          <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function Milestone({ title, sub, done, last }: { title: string; sub: string; done?: boolean; last?: boolean }) {
  return (
    <li className="flex gap-3.5">
      <span className="flex flex-col items-center">
        <span
          className={cn(
            'flex size-6 items-center justify-center rounded-full border-2',
            done ? 'border-ok-fg bg-ok-fg text-surface' : 'border-line-strong bg-surface',
          )}
        >
          {done && <Check size={14} strokeWidth={3} aria-hidden="true" />}
        </span>
        {!last && <span className="h-7 w-0.5 bg-line-strong" />}
      </span>
      <span className="flex flex-col pb-4 font-sans">
        <span className="text-[15px] font-semibold">{title}</span>
        <span className="text-[13px] text-muted">{sub}</span>
      </span>
    </li>
  )
}

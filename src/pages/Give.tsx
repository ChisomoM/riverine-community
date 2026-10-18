import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ChevronLeft, FileDown, Heart, History, Loader2, Share2, ShieldCheck, Smartphone, X, AlertTriangle } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { Button, IconButton, LinkButton } from '@/components/ui/Button'
import { Wordmark } from '@/components/ui/Emblem'
import { SwitchTrack } from '@/components/ui/Switch'
import { Eyebrow, PageTitle } from '@/components/ui/Text'
import { useToast } from '@/components/ui/toast-context'
import type { Gift, GiftCategory, Network } from '@/data/types'
import { DEMO_TODAY } from '@/data/seed'
import { fullDay, isValidPhone, maskPhone, money } from '@/lib/format'
import { cn } from '@/lib/utils'
import { CATEGORIES, categoryLabel, GivingRepo, NETWORKS, networkLabel } from '@/repos/giving'
import { useCurrentMember } from '@/repos/members'

type Step = 'form' | 'prompt' | 'pending' | 'success' | 'failed' | 'receipt'

const QUICK = [50, 100, 200, 500, 1000]

export default function Give() {
  const toast = useToast()
  const member = useCurrentMember()
  const [params] = useSearchParams()
  const presetCat = CATEGORIES.find((c) => c.id === params.get('for'))?.id

  const [step, setStep] = useState<Step>('form')
  const [cat, setCat] = useState<GiftCategory>(presetCat ?? 'tithe')
  const [amount, setAmount] = useState('500')
  const [net, setNet] = useState<Network>('mtn')
  const [phone, setPhone] = useState(member?.phone ?? '')
  const [simulateFail, setSimulateFail] = useState(false)
  const [tried, setTried] = useState(false)
  const [gift, setGift] = useState<Gift | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const value = parseInt(amount, 10) || 0
  const amountLabel = money(value)
  const netLabel = networkLabel(net)
  const amountError = tried && value < 1 ? 'Enter an amount of K1 or more.' : ''
  const phoneError = tried && !isValidPhone(phone) ? 'Enter a 10-digit number, like 097 123 4567.' : ''

  const goto = (next: Step) => {
    window.clearTimeout(timer.current)
    setStep(next)
  }

  const submit = () => {
    if (value < 1 || !isValidPhone(phone)) {
      setTried(true)
      return
    }
    goto('prompt')
  }

  const approve = () => {
    goto('pending')
    timer.current = window.setTimeout(() => {
      const recorded = GivingRepo.record({ category: cat, amount: value, network: net, succeeded: !simulateFail })
      setGift(recorded)
      setStep(simulateFail ? 'failed' : 'success')
    }, 2200)
  }

  const share = async () => {
    const text = `Receipt ${gift?.receipt}: ${amountLabel} to Riverine Community Church`
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // Cancelled
      }
    }
    toast('Sharing is not available on this device')
  }

  if (step === 'form') {
    return (
      <Screen nav className="gap-6">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Eyebrow>TITHES AND OFFERING</Eyebrow>
            <PageTitle>Give</PageTitle>
          </div>
          <Link
            to="/give/history"
            className="flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3.5 font-sans text-sm font-semibold text-ink no-underline"
          >
            <History size={18} strokeWidth={1.5} aria-hidden="true" />
            History
          </Link>
        </header>

        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="mb-2.5 p-0 font-sans text-[11px] font-semibold tracking-eyebrow text-muted">GIVE TOWARDS</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  'flex min-h-[72px] flex-col items-start gap-1 rounded-md border p-3.5 text-left',
                  cat === c.id ? 'border-2 border-inv bg-surface' : 'border-line-strong bg-surface',
                )}
              >
                <span className="font-sans text-[15px] font-semibold">{c.label}</span>
                <span className="font-sans text-xs leading-4 text-muted">{c.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="give-amount" className="font-sans text-[11px] font-semibold tracking-eyebrow text-muted">
            AMOUNT
          </label>
          <div
            className={cn(
              'flex h-16 items-center gap-2 rounded-md border bg-surface px-4',
              amountError ? 'border-2 border-bad-fg' : 'border-line-strong',
            )}
          >
            <span className="font-display text-[28px] font-semibold text-muted">K</span>
            <input
              id="give-amount"
              inputMode="numeric"
              value={amount}
              aria-invalid={!!amountError}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 7))}
              className="h-full min-w-0 flex-1 border-0 bg-transparent font-display text-[32px] font-semibold text-ink outline-offset-0"
            />
          </div>
          {amountError && <span className="font-sans text-[13px] text-bad-fg">{amountError}</span>}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(String(q))}
                className="h-11 shrink-0 rounded-full border border-line-strong bg-surface px-4 font-sans text-sm font-medium"
              >
                {money(q)}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
          <legend className="mb-3 p-0 font-sans text-[11px] font-semibold tracking-eyebrow text-muted">PAY WITH</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {NETWORKS.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={net === n.id}
                onClick={() => setNet(n.id)}
                className={cn(
                  'flex h-14 items-center gap-2.5 rounded-md border bg-surface px-3.5 font-sans text-[15px] font-semibold',
                  net === n.id ? 'border-2 border-inv' : 'border-line-strong',
                )}
              >
                <span className="flex size-5 items-center justify-center rounded-full border-2 border-inv">
                  <span className={cn('size-2.5 rounded-full', net === n.id ? 'bg-ink' : 'bg-transparent')} />
                </span>
                {n.label}
              </button>
            ))}
          </div>
          <label htmlFor="give-phone" className="font-sans text-sm font-medium">
            Mobile money number
          </label>
          <input
            id="give-phone"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            placeholder="097 123 4567"
            aria-invalid={!!phoneError}
            onChange={(e) => setPhone(e.target.value)}
            className={cn(
              'h-[52px] w-full rounded-sm border bg-surface px-3.5 font-sans text-base text-ink',
              phoneError ? 'border-2 border-bad-fg' : 'border-line-strong',
            )}
          />
          {phoneError && <span className="font-sans text-[13px] text-bad-fg">{phoneError}</span>}
        </fieldset>

        <p className="m-0 flex gap-2 font-sans text-[13px] leading-[19px] text-muted">
          <ShieldCheck size={18} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
          Only you and the finance team see this. You'll get a receipt for every gift.
        </p>

        <button
          type="button"
          role="switch"
          aria-checked={simulateFail}
          onClick={() => setSimulateFail(!simulateFail)}
          className="flex h-11 items-center justify-between rounded-md border border-dashed border-line-strong bg-transparent px-3.5"
        >
          <span className="font-sans text-xs font-semibold tracking-label text-muted">DEMO · SIMULATE A FAILED PAYMENT</span>
          <SwitchTrack on={simulateFail} danger />
        </button>

        <Button size="lg" onClick={submit}>
          Give {amountLabel}
        </Button>
      </Screen>
    )
  }

  if (step === 'prompt') {
    return (
      <Screen className="justify-between">
        <IconButton aria-label="Cancel" onClick={() => goto('form')}>
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </IconButton>
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rv-pulse flex size-24 items-center justify-center rounded-full bg-clay-bg text-clay-fg">
            <Smartphone size={40} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <Eyebrow className="text-clay-fg">PROMPT SENT</Eyebrow>
          <PageTitle>Check your phone</PageTitle>
          <p className="m-0 text-[17px] leading-7">
            We've sent a request for <strong>{amountLabel}</strong> to {phone}. Enter your {netLabel} PIN to approve it.
          </p>
          <p className="m-0 font-sans text-[13px] text-muted">The request expires in 2 minutes.</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button size="lg" onClick={approve}>
            I've entered my PIN
          </Button>
          <Button variant="secondary" size="lg" onClick={() => goto('form')}>
            Cancel
          </Button>
        </div>
      </Screen>
    )
  }

  if (step === 'pending') {
    return (
      <Screen className="items-center justify-center text-center">
        <div role="status" className="flex flex-col items-center gap-4">
          <Loader2 size={48} strokeWidth={1.5} className="animate-spin text-clay-fg motion-reduce:animate-none" aria-hidden="true" />
          <Eyebrow className="text-clay-fg">PENDING</Eyebrow>
          <PageTitle>Confirming your gift</PageTitle>
          <p className="m-0 text-[17px] leading-7 text-muted">
            Waiting for {netLabel} to confirm. This usually takes a few seconds. Please keep this screen open.
          </p>
        </div>
      </Screen>
    )
  }

  if (step === 'success') {
    return (
      <Screen className="justify-between">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-ok-bg text-ok-fg">
            <CheckCircle2 size={40} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <Eyebrow className="text-ok-fg">GIFT RECEIVED</Eyebrow>
          <PageTitle>Thank you{member ? `, ${member.name.split(' ')[0]}` : ''}</PageTitle>
          <span className="font-display text-[40px] font-semibold leading-[48px]">{amountLabel}</span>
          <span className="font-sans text-sm text-muted">
            {categoryLabel(cat)} · {netLabel} · Ref {gift?.receipt}
          </span>
          <p className="m-0 max-w-[320px] pt-3 text-base italic leading-6 text-muted">
            “Each of you should give what you have decided in your heart to give.” 2 Corinthians 9:7
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button size="lg" onClick={() => goto('receipt')}>
            View receipt
          </Button>
          <Button variant="secondary" size="lg" onClick={() => goto('form')}>
            Done
          </Button>
        </div>
      </Screen>
    )
  }

  if (step === 'failed') {
    return (
      <Screen className="justify-between">
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-bad-bg text-bad-fg">
            <AlertTriangle size={40} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <Eyebrow className="text-bad-fg">PAYMENT FAILED</Eyebrow>
          <PageTitle>Your gift didn't go through</PageTitle>
          <p className="m-0 text-[17px] leading-7 text-muted">
            The request timed out before it was approved. No money has left your account.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button size="lg" onClick={submit}>
            Try again
          </Button>
          <Button variant="secondary" size="lg" onClick={() => goto('form')}>
            Change number or network
          </Button>
        </div>
      </Screen>
    )
  }

  // Receipt
  return (
    <Screen className="gap-5">
      <div className="no-print flex items-center gap-3">
        <IconButton aria-label="Close receipt" onClick={() => goto('form')}>
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </IconButton>
        <PageTitle className="!text-2xl">Receipt</PageTitle>
      </div>
      <div className="overflow-hidden rounded-md border border-line bg-surface">
        <div className="flex flex-col items-center gap-1.5 border-b border-dashed border-line-strong px-5 py-6 text-center">
          <span className="rounded-md bg-[#fefefc] px-4 py-2"><Wordmark width={180} /></span>
          <Eyebrow className="mt-2">OFFICIAL RECEIPT</Eyebrow>
          <span className="font-display text-[40px] font-semibold leading-[48px]">{amountLabel}</span>
          <span className="rounded-sm bg-ok-bg px-2 py-0.5 font-sans text-xs font-semibold text-ok-fg">Paid</span>
        </div>
        <dl className="m-0 flex flex-col gap-3 p-5 font-sans text-sm">
          {[
            ['Receipt no.', gift?.receipt ?? ''],
            ['Date', `${fullDay(DEMO_TODAY)}, 10:42`],
            ['Given by', member?.name ?? 'Guest'],
            ['Towards', categoryLabel(cat)],
            ['Paid with', `${netLabel} · ${maskPhone(phone)}`],
            ['Transaction ID', gift?.txn ?? ''],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-muted">{k}</dt>
              <dd className="m-0 text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="no-print grid grid-cols-2 gap-2.5">
        <Button variant="secondary" onClick={() => window.print()}>
          <FileDown size={18} strokeWidth={1.5} aria-hidden="true" />
          PDF
        </Button>
        <Button variant="secondary" onClick={share}>
          <Share2 size={18} strokeWidth={1.5} aria-hidden="true" />
          Share
        </Button>
      </div>
      {member ? (
        <LinkButton to="/give/history" variant="secondary" className="no-print">
          <Heart size={18} strokeWidth={1.5} aria-hidden="true" />
          See my giving history
        </LinkButton>
      ) : (
        <p className="no-print m-0 text-center font-sans text-[13px] text-muted">
          <Link to="/join">Become a member</Link> to keep a giving history.
        </p>
      )}
    </Screen>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, LogOut, Moon, RotateCcw, ShieldCheck, Smartphone, Type } from 'lucide-react'
import { Screen } from '@/components/layout/Screen'
import { Button, LinkButton } from '@/components/ui/Button'
import { Emblem } from '@/components/ui/Emblem'
import { LockedCard } from '@/components/ui/LockedCard'
import { SwitchTrack } from '@/components/ui/Switch'
import { Eyebrow, PageTitle } from '@/components/ui/Text'
import { useToast } from '@/components/ui/toast-context'
import { money } from '@/lib/format'
import { useInstall } from '@/lib/install'
import { cn } from '@/lib/utils'
import { useEvents, useRsvps } from '@/repos/events'
import { summarise, useGifts } from '@/repos/giving'
import { type Access, MembersRepo, useAccess, useCurrentMember, useIsAdmin } from '@/repos/members'
import { SettingsRepo, useSettings } from '@/repos/settings'
import { useState } from 'react'

const ROLES: { id: Access; label: string }[] = [
  { id: 'visitor', label: 'Visitor' },
  { id: 'pending', label: 'Pending' },
  { id: 'member', label: 'Member' },
]

export default function Me() {
  const navigate = useNavigate()
  const toast = useToast()
  const member = useCurrentMember()
  const access = useAccess()
  const isAdmin = useIsAdmin()
  const settings = useSettings()
  const gifts = useGifts()
  const events = useEvents()
  const rsvps = useRsvps()
  const { installed, install } = useInstall()
  const [installHidden, setInstallHidden] = useState(false)

  const total = summarise(gifts).total
  const myEvents = events.filter((e) => rsvps.includes(e.id))

  const runInstall = async () => {
    const result = await install()
    if (result === 'accepted') toast('Riverine added to your home screen')
    else if (result === 'manual') toast('Use your browser menu, then "Add to Home screen"')
    setInstallHidden(true)
  }

  const lock = {
    pending: {
      eyebrow: 'PENDING APPROVAL',
      title: 'Almost there',
      body: 'Your profile and giving history unlock once the pastoral team approves your membership.',
    },
    visitor: {
      eyebrow: 'WELCOME',
      title: 'Make Riverine home',
      body: 'Become a member to keep a profile, see your giving history and hear from ministries.',
    },
  }

  return (
    <Screen nav className="gap-[22px]">
      <header className="flex items-center gap-3.5 pt-2">
        {member ? (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-olive-bg font-display text-[26px] font-semibold text-olive-fg">
            {member.name[0]}
          </span>
        ) : (
          <Emblem size={64} className="shrink-0" />
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <PageTitle className="truncate !text-2xl !leading-8">{member?.name ?? 'Welcome, friend'}</PageTitle>
          <Eyebrow className="tracking-normal">
            {access === 'member' ? 'Member since Oct 2026' : access === 'pending' ? 'Membership pending' : 'Visitor'}
          </Eyebrow>
        </div>
      </header>

      {access !== 'member' && (
        <LockedCard {...lock[access]}>
          {access === 'visitor' && (
            <LinkButton to="/join" className="mt-1 px-5">
              Start membership
            </LinkButton>
          )}
          {access === 'pending' && (
            <Link to="/join" className="mt-1 font-sans text-sm font-semibold">
              See my request
            </Link>
          )}
        </LockedCard>
      )}

      {access === 'member' && member && (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/give/history"
              className="flex flex-col gap-1 rounded-md border border-clay-bd bg-clay-bg p-4 text-ink no-underline"
            >
              <span className="font-sans text-[11px] font-semibold tracking-eyebrow text-clay-fg">GIVEN IN 2026</span>
              <span className="font-display text-[26px] font-semibold leading-8">{money(total)}</span>
              <span className="font-sans text-xs text-muted">History and statement</span>
            </Link>
            <Link
              to={myEvents[0] ? `/events/${myEvents[0].id}` : '/'}
              className="flex flex-col gap-1 rounded-md border border-blue-bd bg-blue-bg p-4 text-ink no-underline"
            >
              <span className="font-sans text-[11px] font-semibold tracking-eyebrow text-blue-fg">MY RSVPS</span>
              <span className="font-display text-[26px] font-semibold leading-8">{myEvents.length}</span>
              <span className="truncate font-sans text-xs text-muted">
                {myEvents.length ? myEvents.map((e) => e.title).join(', ') : 'Nothing yet'}
              </span>
            </Link>
          </div>

          <section aria-label="My details" className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="m-0 font-sans text-[13px] font-semibold tracking-eyebrow text-muted">MY DETAILS</h2>
              <Link to="/join" className="flex h-11 items-center font-sans text-sm font-semibold">
                Edit
              </Link>
            </div>
            <dl className="m-0 divide-y divide-line rounded-md border border-line bg-surface font-sans text-[15px]">
              {[
                ['Phone', member.phone],
                ['Area', member.area || 'Not given'],
                ['Household', `${member.household.length + 1} ${member.household.length ? 'people' : 'person'}`],
                ['Ministries', member.ministries.length ? member.ministries.join(', ') : 'None yet'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-muted">{k}</dt>
                  <dd className="m-0 text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      )}

      <section aria-label="Settings" className="flex flex-col gap-2.5">
        <h2 className="m-0 font-sans text-[13px] font-semibold tracking-eyebrow text-muted">SETTINGS</h2>
        <div className="divide-y divide-line rounded-md border border-line bg-surface font-sans">
          <div className="flex min-h-14 items-center gap-3 px-4 py-2">
            <Moon size={20} strokeWidth={1.5} className="text-muted" aria-hidden="true" />
            <span className="grow text-[15px] font-medium">Appearance</span>
            <div role="group" aria-label="Appearance" className="flex rounded-full bg-surface-2 p-1">
              {(['light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={settings.theme === t}
                  onClick={() => SettingsRepo.set({ theme: t })}
                  className={cn(
                    'h-9 rounded-full px-3.5 text-[13px] font-semibold capitalize',
                    settings.theme === t ? 'bg-surface text-ink' : 'bg-transparent text-muted',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.largeText}
            onClick={() => SettingsRepo.set({ largeText: !settings.largeText })}
            className="flex min-h-14 w-full items-center gap-3 bg-transparent px-4 py-2 text-left"
          >
            <Type size={20} strokeWidth={1.5} className="text-muted" aria-hidden="true" />
            <span className="flex grow flex-col">
              <span className="text-[15px] font-medium">Large text</span>
              <span className="text-xs text-muted">Easier reading for everyone</span>
            </span>
            <SwitchTrack on={settings.largeText} />
          </button>
          <button
            type="button"
            onClick={() => toast('Notification settings arrive in the next phase')}
            className="flex min-h-14 w-full items-center gap-3 bg-transparent px-4 py-2 text-left"
          >
            <Bell size={20} strokeWidth={1.5} className="text-muted" aria-hidden="true" />
            <span className="grow text-[15px] font-medium">Notifications</span>
            <ChevronRight size={18} strokeWidth={1.5} className="text-muted" aria-hidden="true" />
          </button>
        </div>
      </section>

      {!installed && !installHidden && (
        <div className="flex items-center gap-3.5 rounded-md border border-line bg-surface p-4">
          <Emblem size={48} className="shrink-0" />
          <div className="flex flex-col gap-2.5 font-sans">
            <span className="flex flex-col">
              <span className="text-[15px] font-semibold">Add Riverine to your home screen</span>
              <span className="text-[13px] text-muted">Opens like an app. No app store needed.</span>
            </span>
            <div className="flex gap-2">
              <Button size="sm" className="px-4" onClick={runInstall}>
                <Smartphone size={16} strokeWidth={1.5} aria-hidden="true" />
                Install
              </Button>
              <Button size="sm" variant="secondary" className="border-0 bg-transparent px-3" onClick={() => setInstallHidden(true)}>
                Not now
              </Button>
            </div>
          </div>
        </div>
      )}

      <section aria-label="Demo tools" className="flex flex-col gap-3 rounded-md border border-dashed border-line-strong p-4">
        <span className="font-sans text-[11px] font-semibold tracking-eyebrow text-muted">DEMO ONLY · VIEW AS</span>
        <div role="group" aria-label="Role" className="grid grid-cols-3 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={access === r.id}
              onClick={() => MembersRepo.viewAs(r.id)}
              className={cn(
                'h-11 rounded-md border font-sans text-sm font-semibold',
                access === r.id ? 'border-inv bg-inv text-on-inv' : 'border-line-strong bg-surface text-ink',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isAdmin}
          onClick={() => MembersRepo.setAdmin(!isAdmin)}
          className="flex h-11 items-center justify-between bg-transparent p-0"
        >
          <span className="font-sans text-sm font-medium">Church office (admin)</span>
          <SwitchTrack on={isAdmin} />
        </button>
        {isAdmin && (
          <LinkButton to="/admin" variant="secondary" size="sm">
            <ShieldCheck size={18} strokeWidth={1.5} aria-hidden="true" />
            Open admin
          </LinkButton>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            SettingsRepo.reset()
            toast('Demo data restored')
          }}
        >
          <RotateCcw size={18} strokeWidth={1.5} aria-hidden="true" />
          Reset demo data
        </Button>
      </section>

      {member && (
        <Button
          variant="secondary"
          className="border-0 bg-transparent text-muted"
          onClick={() => {
            MembersRepo.viewAs('visitor')
            toast('Signed out')
            navigate('/')
          }}
        >
          <LogOut size={18} strokeWidth={1.5} aria-hidden="true" />
          Sign out
        </Button>
      )}
    </Screen>
  )
}

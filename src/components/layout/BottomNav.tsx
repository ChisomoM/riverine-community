import { NavLink } from 'react-router-dom'
import { BookOpen, CalendarDays, Heart, Home, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/teachings', label: 'Teachings', icon: BookOpen },
  { to: '/give', label: 'Give', icon: Heart },
  { to: '/services', label: 'Services', icon: CalendarDays },
  { to: '/me', label: 'Me', icon: User },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="no-print fixed inset-x-0 bottom-0 z-40 mx-auto grid h-[84px] max-w-[480px] grid-cols-5 border-t border-line bg-surface px-1 pb-[18px] pt-2"
    >
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 font-sans text-xs no-underline',
              isActive ? 'font-semibold text-ink' : 'font-medium text-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'flex h-[30px] items-center justify-center rounded-full',
                  isActive ? 'w-14 bg-pill' : 'w-14',
                )}
              >
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

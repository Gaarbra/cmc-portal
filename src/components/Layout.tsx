import clsx from 'clsx';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Home,
  LogOut,
  Moon,
  Search,
  Sun,
  User,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { COLLEGE_SITE, officialUrl } from '@/lib/links';

const NAV = [
  { to: '/', label: 'Overview', icon: Home, end: true },
  { to: '/grades', label: 'Grades', icon: GraduationCap },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/register', label: 'Registration', icon: Search },
  { to: '/finances', label: 'Student Account', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

const MOBILE_NAV = [
  { to: '/', label: 'Overview', icon: Home, end: true },
  { to: '/grades', label: 'Grades', icon: GraduationCap },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/finances', label: 'Account', icon: Wallet },
];

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img src="/icon.svg" alt="" className="h-10 w-10 rounded-sm" />
      <div className="leading-tight">
        <div className={clsx('font-serif text-[17px] font-medium', light ? 'text-white' : '')}>Claremont McKenna</div>
        <div className={clsx('text-[10px] font-semibold uppercase tracking-[0.2em]', light ? 'text-gold-300' : 'text-gold-700 dark:text-gold-400')}>
          Student Portal
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const { student, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-stone-300 bg-paper-card dark:border-stone-800 dark:bg-paper-dark-card lg:flex">
        <div className="border-t-4 border-brand-600 px-6 pb-5 pt-6">
          <Wordmark />
        </div>
        <div className="rule mx-6" />
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 border-l-2 px-3 py-2 text-[15px] transition',
                  isActive
                    ? 'border-brand-600 bg-brand-50/70 font-semibold text-brand-700 dark:border-brand-400 dark:bg-brand-950/50 dark:text-brand-300'
                    : 'border-transparent text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60',
                )
              }
            >
              <Icon className="h-[17px] w-[17px] opacity-80" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}

          <div className="eyebrow px-3 pb-2 pt-6">Official Resources</div>
          <a href={officialUrl('home')} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-1.5 text-sm text-stone-600 hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300">
            Official portal <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a href={COLLEGE_SITE} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-1.5 text-sm text-stone-600 hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300">
            cmc.edu <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </nav>
        <div className="border-t border-stone-300 p-3 dark:border-stone-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 font-serif text-sm text-white">
              {student?.firstName[0]}
              {student?.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                {student?.firstName} {student?.lastName}
              </div>
              <div className="muted truncate font-serif text-xs italic">Class of {student?.classYear}</div>
            </div>
          </div>
          <div className="mt-1 flex gap-1">
            <button onClick={toggle} className="btn-ghost flex-1 !px-2 !py-2 text-xs" aria-label="Toggle dark mode">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {dark ? 'Light' : 'Dark'}
            </button>
            <button onClick={logout} className="btn-ghost flex-1 !px-2 !py-2 text-xs">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 border-b border-stone-300 border-t-4 border-t-brand-600 bg-paper-card/95 backdrop-blur dark:border-stone-800 dark:border-t-brand-600 dark:bg-paper-dark-card/95 lg:hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="" className="h-8 w-8 rounded-sm" />
            <div className="leading-none">
              <div className="font-serif text-base font-medium">Claremont McKenna</div>
              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-700 dark:text-gold-400">Student Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NavLink to="/register" className="btn-ghost !p-2" aria-label="Registration">
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </NavLink>
            <button onClick={toggle} className="btn-ghost !p-2" aria-label="Toggle dark mode">
              {dark ? <Sun className="h-5 w-5" strokeWidth={1.75} /> : <Moon className="h-5 w-5" strokeWidth={1.75} />}
            </button>
            <NavLink to="/profile" className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-brand-600 font-serif text-xs text-white" aria-label="Profile">
              {student?.firstName[0]}
              {student?.lastName[0]}
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <Outlet />
        <footer className="muted mt-16 border-t border-stone-300 pt-4 text-center font-serif text-xs italic dark:border-stone-800">
          An unofficial student-built interface to the Claremont McKenna College portal. Official records are kept at{' '}
          <a className="underline hover:text-brand-700" href={officialUrl('home')} target="_blank" rel="noopener noreferrer">
            portal.claremontmckenna.edu
          </a>
          .
        </footer>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-stone-300 bg-paper-card/95 backdrop-blur dark:border-stone-800 dark:bg-paper-dark-card/95 lg:hidden">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 border-t-2 py-2 text-[11px] font-semibold',
                  isActive ? 'border-brand-600 text-brand-700 dark:text-brand-300' : 'border-transparent text-stone-500',
                )
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

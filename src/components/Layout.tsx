import clsx from 'clsx';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  BookOpen,
  CalendarDays,
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

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/grades', label: 'Grades', icon: GraduationCap },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/register', label: 'Registration', icon: Search },
  { to: '/finances', label: 'Finances', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

// Bottom tab bar has room for five items on a phone.
const MOBILE_NAV = NAV.filter((n) => ['/', '/grades', '/schedule', '/courses', '/finances'].includes(n.to));

export default function Layout() {
  const { student, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
        <div className="flex items-center gap-3 px-6 py-5">
          <img src="/icon.svg" alt="" className="h-9 w-9" />
          <div>
            <div className="text-sm font-bold leading-tight">CMC Portal</div>
            <div className="muted text-xs">Claremont McKenna</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {student?.firstName[0]}
              {student?.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {student?.firstName} {student?.lastName}
              </div>
              <div className="muted truncate text-xs">Class of {student?.classYear}</div>
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
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 lg:hidden">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="" className="h-7 w-7" />
          <span className="text-sm font-bold">CMC Portal</span>
        </div>
        <div className="flex items-center gap-1">
          <NavLink to="/register" className="btn-ghost !p-2" aria-label="Registration">
            <Search className="h-5 w-5" />
          </NavLink>
          <button onClick={toggle} className="btn-ghost !p-2" aria-label="Toggle dark mode">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <NavLink to="/profile" className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white" aria-label="Profile">
            {student?.firstName[0]}
            {student?.lastName[0]}
          </NavLink>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 lg:hidden">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-500',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

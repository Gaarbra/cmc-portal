import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { OFFICIAL, officialUrl, type OfficialKey } from '@/lib/links';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  official,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  official?: OfficialKey;
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
          <h1 className="font-serif text-3xl font-medium leading-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="muted mt-1 font-serif text-base italic">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {action}
          {official && <OfficialLinkButton k={official} />}
        </div>
      </div>
      <div className="rule-double mt-4" />
    </div>
  );
}

export function OfficialLinkButton({ k, label }: { k: OfficialKey; label?: string }) {
  return (
    <a
      href={officialUrl(k)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-700 hover:underline dark:text-brand-300"
      title={OFFICIAL[k].description}
    >
      {label ?? 'Official portal'}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function Card({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={clsx('card', className)}>
      {title && (
        <header className="flex items-center justify-between gap-2 border-b border-stone-200 px-5 py-3 dark:border-stone-800">
          <h2 className="font-serif text-lg font-medium">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function CardLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-brand-700 hover:underline dark:text-brand-300">
      {children}
      <ChevronRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="eyebrow flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className="numeral mt-2 text-[1.65rem] font-medium leading-tight sm:text-4xl">{value}</div>
      {hint && <div className="muted mt-1 text-xs">{hint}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-sm bg-stone-200 dark:bg-stone-800', className)} />;
}

export function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="card border-rose-200 p-6 text-sm text-rose-700 dark:border-rose-900 dark:text-rose-300">
      Couldn’t load this page: {error.message}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="muted py-6 text-center font-serif text-base italic">{children}</p>;
}

export function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div role="tablist" className="inline-flex border-b border-stone-300 dark:border-stone-700">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            '-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition',
            value === o.value ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300' : 'muted border-transparent hover:text-stone-900 dark:hover:text-stone-100',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

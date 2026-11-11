import { useState } from 'react';
import clsx from 'clsx';
import { CreditCard } from 'lucide-react';
import { api } from '@/api';
import { useAsync } from '@/lib/useAsync';
import { Card, ErrorState, Loading, PageHeader, Stat, Tabs } from '@/components/ui';
import { money, shortDate, dueLabel } from '@/lib/format';
import { officialUrl } from '@/lib/links';

const whole = (n: number) => money(Math.round(n)).replace(/\.00$/, '');

export default function Finances() {
  const { data, loading, error } = useAsync(() => api.getFinances());
  const [tab, setTab] = useState<'activity' | 'aid'>('activity');
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState error={error!} />;

  const charges = data.transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const credits = -data.transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const aidTotal = data.aid.reduce((s, a) => s + a.accepted, 0);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Office of Student Accounts" title="Student Account" subtitle="Charges, payments, and financial aid." official="finances" />

      <div className="relative overflow-hidden rounded-sm bg-brand-700 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute inset-2 border border-gold-500/40" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">Current balance</div>
            <div className="numeral mt-1 text-5xl font-medium">{money(data.balance)}</div>
            <div className="mt-1 font-serif text-base italic text-brand-100">
              Due {shortDate(data.dueDate)}
              {dueLabel(data.dueDate) !== shortDate(data.dueDate) && ` (${dueLabel(data.dueDate)})`}
            </div>
          </div>
          <a href={officialUrl('finances')} target="_blank" rel="noopener noreferrer" className="btn bg-paper-card text-brand-700 hover:bg-white">
            <CreditCard className="h-4 w-4" /> Make a payment
          </a>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat label="Charges" value={whole(charges)} />
        <Stat label="Payments & aid" value={whole(credits)} />
        <Stat label="Aid this year" value={whole(aidTotal)} />
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          { value: 'activity', label: 'Account activity' },
          { value: 'aid', label: 'Financial aid' },
        ]}
      />

      {tab === 'activity' ? (
        <Card>
          <ul className="-my-2 divide-y divide-stone-100 dark:divide-stone-800">
            {data.transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.description}</div>
                  <div className="muted text-xs">
                    {shortDate(t.date)} · {t.category}
                  </div>
                </div>
                <div className={clsx('shrink-0 text-sm font-semibold tabular-nums', t.amount < 0 && 'text-emerald-600 dark:text-emerald-400')}>
                  {t.amount < 0 ? '−' : ''}
                  {money(Math.abs(t.amount))}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card>
          <div className="-mx-5 -my-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="muted text-left text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Award</th>
                  <th className="px-5 py-3 text-right font-medium">Offered</th>
                  <th className="px-5 py-3 text-right font-medium">Accepted</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {data.aid.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3">
                      <div className="font-medium">{a.name}</div>
                      <div className="muted text-xs">{a.type}</div>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(a.offered)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{money(a.accepted)}</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={clsx(
                          'chip',
                          a.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : a.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-stone-100 text-stone-600 dark:bg-stone-800',
                        )}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

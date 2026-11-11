import { useState } from 'react';
import clsx from 'clsx';
import { CreditCard } from 'lucide-react';
import { api } from '@/api';
import { useAsync } from '@/lib/useAsync';
import { Card, ErrorState, Loading, PageHeader, Stat, Tabs } from '@/components/ui';
import { money, shortDate, dueLabel } from '@/lib/format';

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
      <PageHeader title="Finances" subtitle="Student account, payments, and financial aid." />

      <div className="card relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm text-brand-100">Current balance</div>
            <div className="mt-1 text-4xl font-bold tabular-nums">{money(data.balance)}</div>
            <div className="mt-1 text-sm text-brand-100">
              Due {shortDate(data.dueDate)} ({dueLabel(data.dueDate)})
            </div>
          </div>
          <button className="btn bg-white text-brand-700 hover:bg-brand-50">
            <CreditCard className="h-4 w-4" /> Make a payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Stat label="Charges" value={money(charges).replace('.00', '')} />
        <Stat label="Payments & aid" value={money(credits).replace('.00', '')} />
        <Stat label="Aid this year" value={money(aidTotal).replace('.00', '')} />
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
          <ul className="-my-2 divide-y divide-zinc-100 dark:divide-zinc-800">
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
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
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
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800',
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

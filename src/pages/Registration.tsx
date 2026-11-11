import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Check, Plus, Search, X } from 'lucide-react';
import { api, type CatalogSection } from '@/api';
import { useAsync } from '@/lib/useAsync';
import { Card, Empty, PageHeader } from '@/components/ui';
import { meetingLabel, minutes } from '@/lib/format';

const CAMPUSES = ['CMC', 'Pomona', 'Scripps', 'HMC', 'Pitzer'];
const PLAN_KEY = 'cmc-plan';

function overlaps(a: CatalogSection, b: CatalogSection) {
  return a.meetings.some((m) =>
    b.meetings.some(
      (n) => m.days.some((d) => n.days.includes(d)) && minutes(m.start) < minutes(n.end) && minutes(n.start) < minutes(m.end),
    ),
  );
}

export default function Registration() {
  const [query, setQuery] = useState('');
  const [campus, setCampus] = useState('');
  const [debounced, setDebounced] = useState('');
  const [plan, setPlan] = useState<CatalogSection[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PLAN_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    } catch {}
  }, [plan]);

  const { data: results, loading } = useAsync(() => api.searchCatalog(debounced, { campus: campus || undefined }), [debounced, campus]);

  const conflicts = useMemo(() => {
    const ids = new Set<string>();
    plan.forEach((a, i) => plan.slice(i + 1).forEach((b) => overlaps(a, b) && (ids.add(a.id), ids.add(b.id))));
    return ids;
  }, [plan]);

  const inPlan = (id: string) => plan.some((p) => p.id === id);
  const toggle = (s: CatalogSection) => setPlan((p) => (inPlan(s.id) ? p.filter((x) => x.id !== s.id) : [...p, s]));
  const credits = plan.reduce((s, c) => s + c.credits, 0);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Spring 2027" title="Registration" subtitle="Search the catalogue of the Claremont Colleges and build your plan." official="registration" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-3">
            <div className="relative">
              <Search className="muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                className="input !pl-9"
                placeholder="Search by course, title, instructor or department"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search courses"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['', ...CAMPUSES].map((c) => (
                <button
                  key={c || 'all'}
                  onClick={() => setCampus(c)}
                  className={clsx(
                    'chip !px-3 !py-1 text-sm transition',
                    campus === c ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300',
                  )}
                >
                  {c || 'All campuses'}
                </button>
              ))}
            </div>
          </div>

          <div className={clsx('space-y-3 transition-opacity', loading && 'opacity-60')}>
            {results?.length === 0 && <Empty>No courses match “{debounced}”.</Empty>}
            {results?.map((s) => {
              const full = s.seats.taken >= s.seats.total;
              const added = inPlan(s.id);
              return (
                <div key={s.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-300">
                        {s.code}-{s.section} · {s.campus}
                      </div>
                      <div className="font-serif text-xl font-medium">{s.title}</div>
                      <div className="muted mt-0.5 text-xs">
                        {s.instructor} · {s.meetings.map(meetingLabel).join(', ')}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(s)}
                      className={clsx('btn shrink-0 !px-3 !py-2', added ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'btn-primary')}
                      aria-label={added ? `Remove ${s.code} from plan` : `Add ${s.code} to plan`}
                    >
                      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      <span className="hidden sm:inline">{added ? 'Added' : 'Add'}</span>
                    </button>
                  </div>
                  <p className="muted mt-2 text-sm">{s.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div
                        className={clsx('h-full rounded-full', full ? 'bg-rose-500' : s.seats.taken / s.seats.total > 0.8 ? 'bg-amber-500' : 'bg-emerald-500')}
                        style={{ width: `${Math.min(100, (s.seats.taken / s.seats.total) * 100)}%` }}
                      />
                    </div>
                    <span className={clsx('text-xs tabular-nums', full ? 'font-semibold text-rose-600' : 'muted')}>
                      {full ? 'Full · waitlist' : `${s.seats.total - s.seats.taken} of ${s.seats.total} seats open`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="order-first lg:sticky lg:top-6 lg:order-none lg:self-start">
          <Card title="My plan" action={<span className="muted text-xs">{credits} credits</span>}>
            {plan.length === 0 ? (
              <Empty>Add courses to start a plan.</Empty>
            ) : (
              <ul className="space-y-3">
                {plan.map((s) => (
                  <li key={s.id} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{s.code}</div>
                      <div className="muted truncate text-xs">{s.meetings.map(meetingLabel).join(', ')}</div>
                      {conflicts.has(s.id) && (
                        <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-amber-600">
                          <AlertTriangle className="h-3 w-3" /> Time conflict
                        </div>
                      )}
                    </div>
                    <button onClick={() => toggle(s)} className="btn-ghost !p-1.5" aria-label={`Remove ${s.code}`}>
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn-primary mt-5 w-full" disabled={plan.length === 0 || conflicts.size > 0} title="Registration opens Nov 17">
              Submit registration
            </button>
            <p className="muted mt-2 text-center text-xs">
              {conflicts.size > 0 ? 'Resolve time conflicts to submit.' : 'Registration opens Nov 17 at 8:00am.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

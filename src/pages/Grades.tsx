import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Calculator, RotateCcw } from 'lucide-react';
import { api, type Term } from '@/api';
import { useAsync } from '@/lib/useAsync';
import { Card, ErrorState, Loading, PageHeader, Stat, Tabs } from '@/components/ui';
import { GRADE_POINTS, cumulativeGpa, gpa, gradeTone } from '@/lib/format';

export default function Grades() {
  const { data: terms, loading, error } = useAsync(() => api.getTerms());
  const [view, setView] = useState<'terms' | 'whatif'>('terms');

  if (loading) return <Loading />;
  if (error || !terms) return <ErrorState error={error!} />;

  const cum = cumulativeGpa(terms);
  const past = terms.filter((t) => !t.current);
  const lastTerm = past[0] ? gpa(past[0].grades) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic Record"
        title="Grades"
        subtitle="Final grades, midterm grades, and your standing over time."
        official="grades"
        action={
          <Tabs
            value={view}
            onChange={setView}
            options={[
              { value: 'terms', label: 'By term' },
              { value: 'whatif', label: 'What-if GPA' },
            ]}
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat label="Cumulative GPA" value={cum.gpa?.toFixed(3) ?? '—'} hint={`${cum.credits} graded credits`} />
        <Stat label={`${past[0]?.name ?? 'Last'} GPA`} value={lastTerm?.gpa?.toFixed(3) ?? '—'} hint={`${lastTerm?.credits ?? 0} credits`} />
        <div className="col-span-2 sm:col-span-1">
          <GpaTrend terms={terms} />
        </div>
      </div>

      {view === 'terms' ? <TermList terms={terms} /> : <WhatIf terms={terms} />}
    </div>
  );
}

function GpaTrend({ terms }: { terms: Term[] }) {
  // Oldest → newest, only terms with final grades.
  const points = [...terms]
    .reverse()
    .filter((t) => t.grades.some((g) => g.grade))
    .map((t) => ({ name: t.name, gpa: gpa(t.grades).gpa ?? 0 }));
  const W = 240;
  const H = 64;
  const min = 2.5;
  const max = 4;
  const x = (i: number) => (points.length === 1 ? W / 2 : 8 + (i * (W - 16)) / (points.length - 1));
  const y = (v: number) => H - 6 - ((Math.max(min, v) - min) / (max - min)) * (H - 12);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.gpa)}`).join(' ');

  return (
    <div className="card h-full p-4 sm:p-5">
      <div className="eyebrow">Term GPA trend</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-16 w-full overflow-visible" role="img" aria-label={points.map((p) => `${p.name}: ${p.gpa.toFixed(2)}`).join(', ')}>
        <path d={path} fill="none" strokeWidth={2.5} className="stroke-brand-600 dark:stroke-brand-400" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={p.name}>
            <circle cx={x(i)} cy={y(p.gpa)} r={4} className="fill-white stroke-brand-600 dark:fill-stone-900 dark:stroke-brand-400" strokeWidth={2} />
            <text x={x(i)} y={y(p.gpa) - 9} textAnchor="middle" className="fill-stone-600 text-[10px] font-semibold dark:fill-stone-300">
              {p.gpa.toFixed(2)}
            </text>
          </g>
        ))}
      </svg>
      <div className="muted mt-1 flex justify-between text-[10px]">
        {points.map((p) => (
          <span key={p.name}>{p.name.replace(/(\w)\w+ (\d\d)(\d\d)/, '$1$3')}</span>
        ))}
      </div>
    </div>
  );
}

function TermList({ terms }: { terms: Term[] }) {
  return (
    <div className="space-y-6">
      {terms.map((t) => {
        const g = gpa(t.grades);
        return (
          <Card
            key={t.id}
            title={
              <span className="flex items-center gap-2">
                {t.name}
                {t.current && <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">In progress</span>}
              </span>
            }
            action={<span className="muted text-xs">{g.gpa != null ? `Term GPA ${g.gpa.toFixed(3)}` : 'Midterm grades shown'}</span>}
          >
            <div className="-mx-5 -my-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="muted text-left text-xs uppercase tracking-wide">
                    <th className="px-5 py-3 font-medium">Course</th>
                    <th className="hidden px-5 py-3 font-medium sm:table-cell">Title</th>
                    <th className="px-5 py-3 text-right font-medium">Credits</th>
                    {t.current && <th className="px-5 py-3 text-right font-medium">Midterm</th>}
                    <th className="px-5 py-3 text-right font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {t.grades.map((row) => (
                    <tr key={row.courseCode}>
                      <td className="px-5 py-3">
                        <div className="font-medium">{row.courseCode}</div>
                        <div className="muted text-xs sm:hidden">{row.title}</div>
                      </td>
                      <td className="hidden px-5 py-3 sm:table-cell">{row.title}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{row.credits.toFixed(2)}</td>
                      {t.current && (
                        <td className="px-5 py-3 text-right">
                          {row.midterm ? <span className={clsx('chip', gradeTone(row.midterm))}>{row.midterm}</span> : <span className="muted">—</span>}
                        </td>
                      )}
                      <td className="px-5 py-3 text-right">
                        <span className={clsx('chip font-semibold', gradeTone(row.grade))}>{row.grade ?? 'IP'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

const LETTERS = Object.keys(GRADE_POINTS).filter((g) => g !== 'A+');

function WhatIf({ terms }: { terms: Term[] }) {
  const current = terms.find((t) => t.current);
  const initial = () =>
    Object.fromEntries((current?.grades ?? []).filter((g) => g.credits > 0).map((g) => [g.courseCode, g.midterm ?? 'B+']));
  const [picks, setPicks] = useState<Record<string, string>>(initial);

  const result = useMemo(() => {
    const past = terms.filter((t) => !t.current).flatMap((t) => t.grades);
    const projected = (current?.grades ?? []).filter((g) => g.credits > 0).map((g) => ({ ...g, grade: picks[g.courseCode] }));
    return { term: gpa(projected), cum: gpa([...past, ...projected]), before: gpa(past) };
  }, [picks, terms, current]);

  if (!current) return null;
  const delta = (result.cum.gpa ?? 0) - (result.before.gpa ?? 0);

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          What-if: {current.name}
        </span>
      }
      action={
        <button className="btn-ghost !px-2 !py-1 text-xs" onClick={() => setPicks(initial())}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset to midterms
        </button>
      }
    >
      <p className="muted mb-4 text-sm">Pick the grade you expect in each class to see where your GPA lands.</p>
      <ul className="divide-y divide-stone-100 dark:divide-stone-800">
        {current.grades
          .filter((g) => g.credits > 0)
          .map((g) => (
            <li key={g.courseCode} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{g.courseCode}</div>
                <div className="muted truncate text-xs">{g.title}</div>
              </div>
              <select
                className="input !w-24 !py-1.5 text-center font-semibold"
                value={picks[g.courseCode]}
                onChange={(e) => setPicks((p) => ({ ...p, [g.courseCode]: e.target.value }))}
                aria-label={`Expected grade for ${g.courseCode}`}
              >
                {LETTERS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </li>
          ))}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm bg-stone-50 p-4 dark:bg-stone-800/50">
        <div>
          <div className="muted text-xs">Projected term GPA</div>
          <div className="numeral text-3xl font-medium">{result.term.gpa?.toFixed(3)}</div>
        </div>
        <div>
          <div className="muted text-xs">Projected cumulative</div>
          <div className="numeral text-3xl font-medium">
            {result.cum.gpa?.toFixed(3)}{' '}
            <span className={clsx('text-sm font-semibold', delta >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
              {delta >= 0 ? '+' : ''}
              {delta.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

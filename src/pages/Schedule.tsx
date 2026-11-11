import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { MapPin } from 'lucide-react';
import { api, type Course, type Day } from '@/api';
import { useAsync } from '@/lib/useAsync';
import { Card, ErrorState, Loading, PageHeader, Tabs } from '@/components/ui';
import { DAYS, courseColor, minutes, time12, todayDay } from '@/lib/format';

const START = 8 * 60; // 8am
const END = 21 * 60; // 9pm
const PX_PER_MIN = 1.1;

export default function Schedule() {
  const { data: courses, loading, error } = useAsync(() => api.getCourses());
  const [view, setView] = useState<'week' | 'list'>(() => (window.innerWidth < 640 ? 'list' : 'week'));

  if (loading) return <Loading />;
  if (error || !courses) return <ErrorState error={error!} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Weekly Timetable"
        title="Schedule"
        official="schedule"
        subtitle={`${courses[0]?.term ?? ''} · ${courses.length} courses`}
        action={
          <Tabs
            value={view}
            onChange={setView}
            options={[
              { value: 'week', label: 'Week' },
              { value: 'list', label: 'By day' },
            ]}
          />
        }
      />
      {view === 'week' ? <WeekGrid courses={courses} /> : <DayList courses={courses} />}
    </div>
  );
}

function blocksFor(courses: Course[], day: Day) {
  return courses
    .flatMap((c) => c.meetings.filter((m) => m.days.includes(day)).map((m) => ({ c, m })))
    .sort((a, b) => minutes(a.m.start) - minutes(b.m.start));
}

function WeekGrid({ courses }: { courses: Course[] }) {
  const hours = Array.from({ length: (END - START) / 60 }, (_, i) => START / 60 + i);
  const today = todayDay();
  return (
    <div className="card overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-[3.5rem_repeat(5,1fr)]">
        <div />
        {DAYS.map((d) => (
          <div key={d} className={clsx('border-b border-stone-100 py-3 text-center text-sm font-semibold dark:border-stone-800', d === today && 'text-brand-600 dark:text-brand-400')}>
            {d}
          </div>
        ))}
        <div className="relative" style={{ height: (END - START) * PX_PER_MIN }}>
          {hours.map((h) => (
            <div key={h} className="muted absolute right-2 -translate-y-1/2 text-[10px] tabular-nums" style={{ top: (h * 60 - START) * PX_PER_MIN }}>
              {h > 12 ? h - 12 : h}
              {h >= 12 ? 'pm' : 'am'}
            </div>
          ))}
        </div>
        {DAYS.map((d) => (
          <div key={d} className={clsx('relative border-l border-stone-100 dark:border-stone-800', d === today && 'bg-brand-50/40 dark:bg-brand-950/20')}>
            {hours.map((h) => (
              <div key={h} className="absolute inset-x-0 border-t border-stone-100 dark:border-stone-800/70" style={{ top: (h * 60 - START) * PX_PER_MIN }} />
            ))}
            {blocksFor(courses, d).map(({ c, m }, i) => (
              <Link
                key={i}
                to={`/courses/${c.id}`}
                className={clsx('absolute inset-x-1 overflow-hidden rounded-sm border-l-4 p-1.5 text-xs leading-tight transition hover:brightness-95', courseColor(c.color).block)}
                style={{ top: (minutes(m.start) - START) * PX_PER_MIN, height: (minutes(m.end) - minutes(m.start)) * PX_PER_MIN }}
              >
                <div className="font-semibold">{c.code}</div>
                <div className="truncate opacity-80">{m.location}</div>
                <div className="opacity-70 tabular-nums">
                  {time12(m.start)}–{time12(m.end)}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayList({ courses }: { courses: Course[] }) {
  const today = todayDay();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {DAYS.map((d) => {
        const items = blocksFor(courses, d);
        return (
          <Card key={d} title={<span className={clsx(d === today && 'text-brand-600 dark:text-brand-400')}>{d === today ? `${d} · Today` : d}</span>}>
            {items.length === 0 ? (
              <p className="muted text-sm">No classes</p>
            ) : (
              <ul className="space-y-3">
                {items.map(({ c, m }, i) => (
                  <li key={i}>
                    <Link to={`/courses/${c.id}`} className="flex items-center gap-3">
                      <div className={clsx('h-10 w-1 rounded-full', courseColor(c.color).dot)} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">
                          {c.code} <span className="muted font-normal">· {c.title}</span>
                        </div>
                        <div className="muted flex items-center gap-1 text-xs">
                          {time12(m.start)}–{time12(m.end)} · <MapPin className="h-3 w-3" /> {m.location}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}

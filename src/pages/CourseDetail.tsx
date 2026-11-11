import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft, Download, FileText, Mail, MapPin } from 'lucide-react';
import { api } from '@/api';
import { useAsync } from '@/lib/useAsync';
import { Card, Empty, ErrorState, Loading } from '@/components/ui';
import { courseColor, daysUntil, meetingLabel, relativeDay, shortDate, dueLabel } from '@/lib/format';

export default function CourseDetail() {
  const { id } = useParams();
  const { data: courses, loading, error } = useAsync(() => api.getCourses());
  if (loading) return <Loading />;
  if (error || !courses) return <ErrorState error={error!} />;
  const c = courses.find((x) => x.id === id);
  if (!c) return <ErrorState error={new Error('Course not found')} />;

  const assignments = [...(c.assignments ?? [])].sort((a, b) => a.due.localeCompare(b.due));
  const graded = assignments.filter((a) => a.score != null && a.points);
  const pct = graded.length ? (graded.reduce((s, a) => s + a.score!, 0) / graded.reduce((s, a) => s + a.points!, 0)) * 100 : null;

  return (
    <div className="space-y-6">
      <Link to="/courses" className="muted inline-flex items-center gap-1 text-sm hover:text-zinc-900 dark:hover:text-zinc-100">
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      <div className="card overflow-hidden">
        <div className={clsx('h-2', courseColor(c.color).dot)} />
        <div className="p-6">
          <div className={clsx('text-xs font-bold uppercase tracking-wide', courseColor(c.color).text)}>
            {c.code}-{c.section} · {c.campus} · {c.term}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{c.title}</h1>
          {c.description && <p className="muted mt-2 max-w-2xl text-sm">{c.description}</p>}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href={`mailto:${c.instructor.email}`} className="inline-flex items-center gap-1.5 hover:underline">
              <Mail className="h-4 w-4" /> {c.instructor.name}
            </a>
            {c.meetings.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {meetingLabel(m)} · {m.location}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Coursework" action={pct != null && <span className="text-xs font-semibold">Current: {pct.toFixed(1)}%</span>}>
            {assignments.length === 0 ? (
              <Empty>No coursework posted.</Empty>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {assignments.map((a) => {
                  const d = daysUntil(a.due);
                  const done = a.score != null;
                  return (
                    <li key={a.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div>
                        <div className="text-sm font-medium">{a.title}</div>
                        <div className={clsx('text-xs', !done && d >= 0 && d <= 3 ? 'font-medium text-brand-600 dark:text-brand-400' : 'muted')}>
                          {done ? `Due ${shortDate(a.due)}` : d < 0 ? `Was due ${shortDate(a.due)}` : `Due ${dueLabel(a.due)}`}
                        </div>
                      </div>
                      <div className="text-right text-sm tabular-nums">
                        {done ? (
                          <span className="font-semibold">
                            {a.score}/{a.points}
                          </span>
                        ) : (
                          <span className="muted">{a.points ? `— /${a.points}` : '—'}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Announcements">
            {(c.announcements ?? []).length === 0 ? (
              <Empty>No announcements yet.</Empty>
            ) : (
              <ul className="space-y-4">
                {c.announcements!.map((a) => (
                  <li key={a.id}>
                    <div className="muted text-xs">{relativeDay(a.date)}</div>
                    <div className="text-sm font-semibold">{a.title}</div>
                    <p className="muted text-sm">{a.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Handouts">
          {(c.handouts ?? []).length === 0 ? (
            <Empty>No files.</Empty>
          ) : (
            <ul className="space-y-1">
              {c.handouts!.map((f) => (
                <li key={f.id}>
                  <button className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-lg p-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <FileText className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{f.name}</div>
                      <div className="muted text-xs">{f.size}</div>
                    </div>
                    <Download className="muted h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

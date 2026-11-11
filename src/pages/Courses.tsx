import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRight, MapPin, User } from 'lucide-react';
import { api } from '@/api';
import { useAsync } from '@/lib/useAsync';
import { ErrorState, Loading, PageHeader } from '@/components/ui';
import { courseColor, daysUntil, meetingLabel } from '@/lib/format';

export default function Courses() {
  const { data: courses, loading, error } = useAsync(() => api.getCourses());
  if (loading) return <Loading />;
  if (error || !courses) return <ErrorState error={error!} />;

  return (
    <div>
      <PageHeader title="My Courses" subtitle={courses[0]?.term} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => {
          const due = (c.assignments ?? []).filter((a) => a.score == null && daysUntil(a.due) >= 0).length;
          const news = (c.announcements ?? []).filter((a) => daysUntil(a.date) >= -7).length;
          return (
            <Link key={c.id} to={`/courses/${c.id}`} className="card group flex flex-col overflow-hidden transition hover:shadow-md">
              <div className={clsx('h-1.5', courseColor(c.color).dot)} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className={clsx('text-xs font-bold uppercase tracking-wide', courseColor(c.color).text)}>
                      {c.code}-{c.section} · {c.campus}
                    </div>
                    <h2 className="mt-1 font-semibold leading-snug">{c.title}</h2>
                  </div>
                  <ChevronRight className="muted h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" />
                </div>
                <div className="muted mt-3 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> {c.instructor.name}
                  </div>
                  {c.meetings.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {meetingLabel(m)}
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex gap-2 pt-4">
                  {due > 0 && <span className="chip bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">{due} due</span>}
                  {news > 0 && <span className="chip bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">{news} new</span>}
                  <span className="chip bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{c.credits} cr</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

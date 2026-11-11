import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, CalendarClock, GraduationCap, MapPin, Wallet, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { api } from '@/api';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useAsync';
import { Card, CardLink, ErrorState, Loading, Stat, Empty } from '@/components/ui';
import {
  courseColor,
  cumulativeGpa,
  daysUntil,
  longDate,
  minutes,
  money,
  relativeDay,
  time12,
  today,
  todayDay,
  DAYS,
  dueLabel,
} from '@/lib/format';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Dashboard() {
  const { student } = useAuth();
  const { data, loading, error } = useAsync(() =>
    Promise.all([api.getCourses(), api.getTerms(), api.getFinances(), api.getAnnouncements(), api.getDeadlines()]),
  );

  if (loading) return <Loading />;
  if (error || !data) return <ErrorState error={error!} />;
  const [courses, terms, finances, announcements, deadlines] = data;

  const { gpa, credits } = cumulativeGpa(terms);
  const current = terms.find((t) => t.current);
  const enrolledCredits = current?.grades.reduce((s, g) => s + g.credits, 0) ?? 0;

  // Today's classes, or the next weekday's if it's the weekend / after hours.
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let day = todayDay();
  let label = 'Today';
  if (!day) {
    day = 'Mon';
    label = 'Monday';
  }
  const classesOn = (d: string) =>
    courses
      .flatMap((c) => c.meetings.filter((m) => m.days.includes(d as never)).map((m) => ({ course: c, meeting: m })))
      .sort((a, b) => minutes(a.meeting.start) - minutes(b.meeting.start));
  let todays = classesOn(day);
  if (label === 'Today' && todays.every((t) => minutes(t.meeting.end) < nowMin)) {
    const next = DAYS[(DAYS.indexOf(day) + 1) % 5];
    todays = classesOn(next);
    label = next === 'Mon' ? 'Monday' : 'Tomorrow';
  }

  const upcoming = deadlines.filter((d) => daysUntil(d.date) >= 0).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <p className="muted text-sm">{longDate(today())}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting()}, {student?.firstName}
        </h1>
      </div>

      {student?.holds.map((h) => (
        <Link
          key={h.id}
          to="/profile"
          className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <div className="font-semibold">Hold: {h.title}</div>
            <div className="opacity-80">{h.description}</div>
          </div>
        </Link>
      ))}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Link to="/grades">
          <Stat icon={<GraduationCap className="h-4 w-4" />} label="Cumulative GPA" value={gpa?.toFixed(2) ?? '—'} hint={`${credits} graded credits`} />
        </Link>
        <Link to="/courses">
          <Stat icon={<BookOpen className="h-4 w-4" />} label={current?.name ?? 'Term'} value={courses.length} hint={`courses · ${enrolledCredits} credits`} />
        </Link>
        <Link to="/finances">
          <Stat
            icon={<Wallet className="h-4 w-4" />}
            label="Balance due"
            value={<span className={finances.balance > 0 ? 'text-brand-600 dark:text-brand-400' : ''}>{money(finances.balance)}</span>}
            hint={`Due ${dueLabel(finances.dueDate)}`}
          />
        </Link>
        <Link to="/schedule">
          <Stat icon={<CalendarClock className="h-4 w-4" />} label="Next deadline" value={upcoming[0] ? relativeDay(upcoming[0].date) : '—'} hint={upcoming[0]?.title} />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" title={`${label}'s classes`} action={<CardLink to="/schedule">Full week</CardLink>}>
          {todays.length === 0 ? (
            <Empty>No classes. Enjoy the day.</Empty>
          ) : (
            <ol className="space-y-3">
              {todays.map(({ course, meeting }, i) => {
                const live = label === 'Today' && nowMin >= minutes(meeting.start) && nowMin <= minutes(meeting.end);
                return (
                  <li key={i}>
                    <Link to={`/courses/${course.id}`} className="flex gap-4 rounded-xl p-2 -m-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <div className="w-16 shrink-0 text-right">
                        <div className="text-sm font-semibold tabular-nums">{time12(meeting.start)}</div>
                        <div className="muted text-xs tabular-nums">{time12(meeting.end)}</div>
                      </div>
                      <div className={clsx('w-1 rounded-full', courseColor(course.color).dot)} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{course.code}</span>
                          {live && <span className="chip bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Now</span>}
                        </div>
                        <div className="muted truncate text-sm">{course.title}</div>
                        <div className="muted mt-0.5 flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          {meeting.location}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        <Card className="lg:col-span-2" title="Coming up">
          <ul className="space-y-3">
            {upcoming.map((d) => {
              const n = daysUntil(d.date);
              return (
                <li key={d.id} className="flex items-start gap-3">
                  <div
                    className={clsx(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-xl text-center text-xs font-bold leading-none',
                      n <= 2 ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300' : 'bg-zinc-100 dark:bg-zinc-800',
                    )}
                  >
                    {new Date(d.date + 'T12:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    <br />
                    {new Date(d.date + 'T12:00').getDate()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{d.title}</div>
                    <div className="muted text-xs">
                      {relativeDay(d.date)} · {d.category}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Midterm grades" action={<CardLink to="/grades">All grades</CardLink>}>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {current?.grades.map((g) => (
              <li key={g.courseCode} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{g.courseCode}</div>
                  <div className="muted truncate text-xs">{g.title}</div>
                </div>
                <span className="text-sm font-semibold tabular-nums">{g.grade ?? g.midterm ?? '—'}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={<span className="flex items-center gap-2"><Bell className="h-4 w-4" />Announcements</span>}>
          <ul className="space-y-4">
            {announcements.map((a) => (
              <li key={a.id}>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-brand-600 dark:text-brand-400">{a.source}</span>
                  <span className="muted">· {relativeDay(a.date)}</span>
                  {a.important && <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">Important</span>}
                </div>
                <div className="mt-1 text-sm font-medium">{a.title}</div>
                <p className="muted mt-0.5 text-sm">{a.body}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

    </div>
  );
}

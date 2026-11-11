import { AlertTriangle, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Card, PageHeader } from '@/components/ui';

export default function Profile() {
  const { student, logout } = useAuth();
  if (!student) return null;
  const rows: [string, string][] = [
    ['Student ID', student.id],
    ['Email', student.email],
    ['Class year', String(student.classYear)],
    ['Major', student.majors.join(', ')],
    ['Minor', student.minors.join(', ') || '—'],
    ['Mailbox', student.mailbox],
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" />
      <div className="card flex items-center gap-4 p-6">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-xl font-bold text-white">
          {student.firstName[0]}
          {student.lastName[0]}
        </div>
        <div>
          <div className="text-xl font-bold">
            {student.firstName} {student.lastName}
          </div>
          <div className="muted text-sm">
            {student.majors.join(' & ')} · Class of {student.classYear}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Student information">
          <dl className="divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                <dt className="muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="space-y-6">
          <Card title="Advisor">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{student.advisor.name}</div>
              <a href={`mailto:${student.advisor.email}`} className="btn-ghost !px-3 !py-1.5 text-xs">
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
          </Card>
          <Card title="Holds">
            {student.holds.length === 0 ? (
              <p className="muted text-sm">No holds on your account.</p>
            ) : (
              <ul className="space-y-3">
                {student.holds.map((h) => (
                  <li key={h.id} className="flex gap-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                      <div className="font-medium">{h.title}</div>
                      <div className="muted">{h.description}</div>
                      <div className="mt-1 text-xs font-medium">{h.blocksRegistration ? 'Blocks registration' : 'Does not block registration'}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <button onClick={logout} className="btn-ghost w-full border border-zinc-200 dark:border-zinc-800 lg:hidden">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}

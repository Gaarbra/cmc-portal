import type { Day, GradeEntry, Meeting, Term } from '@/api';

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const shortDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const longDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export function time12(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}${suffix}`;
}

export const meetingLabel = (m: Meeting) => `${m.days.join('/')} · ${time12(m.start)}–${time12(m.end)}`;

export const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function daysUntil(iso: string, from = today()) {
  const a = new Date(from + 'T12:00:00').getTime();
  const b = new Date(iso + 'T12:00:00').getTime();
  return Math.round((b - a) / 86_400_000);
}

export const relativeDay = (iso: string) => {
  const d = daysUntil(iso);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d === -1) return 'Yesterday';
  if (d < 0) return `${-d} days ago`;
  if (d < 7) return `In ${d} days`;
  return shortDate(iso);
};

/** "due tomorrow", "due in 3 days", "due Dec 1" — lowercases relative words only. */
export const dueLabel = (iso: string) => {
  const r = relativeDay(iso);
  return /^(Today|Tomorrow|Yesterday|In )/.test(r) ? r[0].toLowerCase() + r.slice(1) : r;
};

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function todayDay(): Day | null {
  const i = new Date().getDay(); // 0 = Sun
  return i >= 1 && i <= 5 ? DAYS[i - 1] : null;
}

// Standard 4.0 scale used by the Claremont Colleges.
export const GRADE_POINTS: Record<string, number> = {
  'A+': 4, A: 4, 'A-': 3.7, 'B+': 3.3, B: 3, 'B-': 2.7, 'C+': 2.3, C: 2, 'C-': 1.7, 'D+': 1.3, D: 1, 'D-': 0.7, F: 0,
};

export function gpa(entries: GradeEntry[]) {
  let pts = 0;
  let cr = 0;
  for (const e of entries) {
    if (e.grade == null || !(e.grade in GRADE_POINTS) || e.credits === 0) continue;
    pts += GRADE_POINTS[e.grade] * e.credits;
    cr += e.credits;
  }
  return { gpa: cr ? pts / cr : null, credits: cr, points: pts };
}

export const cumulativeGpa = (terms: Term[]) => gpa(terms.flatMap((t) => t.grades));

export function gradeTone(grade: string | null | undefined) {
  if (!grade) return 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400';
  if (grade.startsWith('A')) return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300';
  if (grade.startsWith('B')) return 'text-sky-700 bg-sky-50 dark:bg-sky-950 dark:text-sky-300';
  if (grade.startsWith('C')) return 'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300';
  return 'text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-300';
}

// Tailwind needs full class names at build time, so map course colors explicitly.
export const COURSE_COLORS: Record<string, { block: string; dot: string; text: string }> = {
  rose: { block: 'bg-rose-100 border-rose-400 text-rose-900 dark:bg-rose-950/70 dark:text-rose-100', dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
  sky: { block: 'bg-sky-100 border-sky-400 text-sky-900 dark:bg-sky-950/70 dark:text-sky-100', dot: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' },
  amber: { block: 'bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-950/70 dark:text-amber-100', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  emerald: { block: 'bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  violet: { block: 'bg-violet-100 border-violet-400 text-violet-900 dark:bg-violet-950/70 dark:text-violet-100', dot: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
  slate: { block: 'bg-slate-100 border-slate-400 text-slate-900 dark:bg-slate-800 dark:text-slate-100', dot: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400' },
};
export const courseColor = (c: string) => COURSE_COLORS[c] ?? COURSE_COLORS.slate;

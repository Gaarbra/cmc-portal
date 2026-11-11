import { useState } from 'react';
import { ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { officialUrl } from '@/lib/links';
import { Wordmark } from '@/components/Layout';

// Until a real backend exists this page deliberately has no password field:
// a site that isn't on a cmc.edu domain should never ask for CMC credentials
// it can't use.
export default function Login() {
  const { login } = useAuth();
  const [busy, setBusy] = useState(false);

  const enter = async () => {
    setBusy(true);
    await login('preview', '');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-700 p-14 text-white lg:flex">
        <div className="pointer-events-none absolute inset-6 border border-gold-500/40" />
        <div className="relative">
          <Wordmark light />
        </div>
        <div className="relative max-w-lg">
          <div className="mb-6 h-px w-16 bg-gold-400" />
          <h1 className="font-serif text-5xl font-medium leading-[1.1]">Your academic life, in good order.</h1>
          <p className="mt-5 font-serif text-xl italic leading-relaxed text-brand-100">
            Grades, schedule, courses and your student account, gathered in one place.
          </p>
        </div>
        <div className="relative">
          <p className="font-serif text-lg italic text-gold-300">Crescit cum commercio civitas</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-200">Claremont, California · Founded 1946</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Wordmark />
          </div>
          <div className="eyebrow">Welcome</div>
          <h2 className="mt-1 font-serif text-4xl font-medium">Student Portal</h2>
          <div className="rule-double mt-4" />

          <p className="mt-6 font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            This preview runs on sample records so you can explore the new design. Your real records are unaffected.
          </p>

          <button className="btn-primary mt-8 w-full !py-3" onClick={enter} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Enter the preview
            {!busy && <ArrowRight className="h-4 w-4" />}
          </button>

          <a href={officialUrl('home')} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 w-full !py-3">
            Go to the official portal <ExternalLink className="h-4 w-4" />
          </a>

          <p className="muted mt-10 border-t border-stone-300 pt-4 font-serif text-xs italic dark:border-stone-700">
            An unofficial, student-built interface. Not affiliated with or endorsed by Claremont McKenna College. Never enter your CMC password on a site that isn't run by the College.
          </p>
        </div>
      </div>
    </div>
  );
}

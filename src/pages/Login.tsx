import { useState, type FormEvent } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <img src="/icon.svg" alt="" className="h-10 w-10 rounded-xl ring-2 ring-white/20" />
          <span className="text-lg font-semibold">CMC Portal</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight">Your grades, schedule and account, without the hunting.</h1>
          <p className="mt-4 text-brand-100">Everything from the student portal, organized around what you check every day.</p>
        </div>
        <p className="relative text-xs text-brand-200">An unofficial student-built interface.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/icon.svg" alt="" className="h-10 w-10" />
            <span className="text-lg font-bold">CMC Portal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="muted mt-1 text-sm">Use your CMC portal username and password.</p>

          <label className="mt-8 block text-sm font-medium" htmlFor="u">
            Username
          </label>
          <input id="u" className="input mt-1.5" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="arivera27" autoFocus />

          <label className="mt-4 block text-sm font-medium" htmlFor="p">
            Password
          </label>
          <input id="p" type="password" className="input mt-1.5" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

          <button className="btn-primary mt-6 w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Sign in
          </button>

          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-3 text-xs text-zinc-500 dark:border-zinc-700">
            <strong className="text-zinc-700 dark:text-zinc-300">Demo mode:</strong> the app is running on sample data. Enter any username to explore.
          </div>
        </form>
      </div>
    </div>
  );
}

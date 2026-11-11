import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type Student } from '@/api';

interface AuthCtx {
  student: Student | null;
  ready: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>(null!);
const KEY = 'cmc-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let signedIn = false;
    try {
      signedIn = localStorage.getItem(KEY) === '1';
    } catch {}
    if (!signedIn) return setReady(true);
    api.getStudent().then(setStudent).finally(() => setReady(true));
  }, []);

  const login = async (u: string, p: string) => {
    const s = await api.login(u, p);
    try {
      localStorage.setItem(KEY, '1');
    } catch {}
    setStudent(s);
  };
  const logout = async () => {
    await api.logout();
    try {
      localStorage.removeItem(KEY);
    } catch {}
    setStudent(null);
  };

  return <Ctx.Provider value={{ student, ready, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

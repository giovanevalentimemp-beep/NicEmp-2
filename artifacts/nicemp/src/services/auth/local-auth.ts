const SESSION_KEY = "nicemp_local_admin_session";

const LOCAL_ADMINS: Record<string, string> = {
  "nicemp.admin@gmail.com": "nicemp6767",
};

export interface LocalAdminSession {
  email: string;
  role: "admin";
  loginAt: number;
}

export function tryLocalLogin(email: string, password: string): boolean {
  const expected = LOCAL_ADMINS[email.toLowerCase().trim()];
  if (!expected || expected !== password) return false;
  const session: LocalAdminSession = {
    email: email.toLowerCase().trim(),
    role: "admin",
    loginAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

export function getLocalAdminSession(): LocalAdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalAdminSession;
  } catch {
    return null;
  }
}

export function clearLocalAdminSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

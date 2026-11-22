import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// The wizard creates apps as the logged-in SERMAS user. The access token lives in
// this tab only (sessionStorage) and goes to the wizard server as a bearer token.

const STORAGE_KEY = "sermas-wizard-session";

export type Session = { accessToken: string; expiresAt: number };

type Auth = {
  session: Session | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  /** The access token, or null when there is none or it has expired. */
  token: () => string | null;
};

const AuthContext = createContext<Auth | null>(null);

const load = (): Session | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
};

const save = (session: Session | null) => {
  try {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable: the session lasts as long as the page
  }
};

export class LoginError extends Error {}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(() => {
    const stored = load();
    return stored && stored.expiresAt > Date.now() ? stored : null;
  });

  const update = useCallback((next: Session | null) => {
    save(next);
    setSession(next);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 401) throw new LoginError("Wrong username or password");
      if (!res.ok) throw new LoginError(`Login failed (${res.status})`);
      const { responseObject } = await res.json();
      update({
        accessToken: responseObject.access_token,
        expiresAt: Date.now() + responseObject.expires_in * 1000,
      });
    },
    [update],
  );

  const logout = useCallback(() => update(null), [update]);

  const token = useCallback(
    () => (session && session.expiresAt > Date.now() ? session.accessToken : null),
    [session],
  );

  return (
    <AuthContext.Provider value={{ session, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): Auth => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth outside AuthProvider");
  return auth;
};

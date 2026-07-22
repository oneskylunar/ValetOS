"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Three seeded accounts from server/data/store.js. Used for the
// one-click "Use this" quick-fill rows.
const DEMO_ACCOUNTS: { email: string; label: string; role: string }[] = [
  { email: "manager@valetos.com", label: "Manager", role: "manager" },
  { email: "valet@valetos.com",   label: "Valet",   role: "valet"   },
  { email: "admin@valetos.com",   label: "Admin",   role: "admin"   },
];

const TOKEN_KEY  = "valetos.token";
const USER_KEY   = "valetos.user";
const API_BASE   = "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [user, setUser]         = useState<LoggedInUser | null>(null);

  // On mount, if a token is already in localStorage, decode the payload
  // client-side and show the success panel straight away. Lets the user
  // refresh /login without losing their session for the demo.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      setUser({
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      });
    } catch {
      // Malformed token — clear it so the form shows up clean.
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body.message || "Login failed");
        return;
      }
      window.localStorage.setItem(TOKEN_KEY, body.data.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(body.data.user));
      setUser(body.data.user);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    try {
      // Server is stateless, but the call is symmetric with login and
      // would matter once a real auth backend lands.
      await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
    } catch {
      // ignore — we're clearing local state regardless
    }
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
    setEmail("");
    setPassword("");
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("password123");
    setError(null);
  }

  return (
    <main className="min-h-screen bg-bg0 text-dark flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md flex flex-col gap-4">
        <button
          onClick={() => router.push("/")}
          className="self-start text-sm font-semibold text-fg0 hover:text-dark transition-colors"
        >
          ← Back to home
        </button>

        <div className="bg-bg1 text-bg0 p-8 shadow-2xl border border-bg0/20">
          {user ? (
            <SignedInPanel user={user} onSignOut={handleSignOut} onHome={() => router.push("/home")} />
          ) : (
            <SignInForm
              email={email}
              password={password}
              busy={busy}
              error={error}
              onEmail={setEmail}
              onPassword={setPassword}
              onSubmit={handleSubmit}
              onFillDemo={fillDemo}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function SignInForm(props: {
  email: string;
  password: string;
  busy: boolean;
  error: string | null;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onFillDemo: (email: string) => void;
}) {
  const { email, password, busy, error, onEmail, onPassword, onSubmit, onFillDemo } = props;
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
        Sign in to ValetOS
      </h1>
      <p className="text-sm text-bg0/70 mb-6">
        Use a seeded demo account to explore the platform.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-bg0/80">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="you@valetos.com"
            className="w-full px-4 py-3 bg-bg0/10 border border-bg0/20 text-bg0 placeholder-bg0/40 focus:outline-none focus:border-bg0/60 text-sm font-medium transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-bg0/80">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-bg0/10 border border-bg0/20 text-bg0 placeholder-bg0/40 focus:outline-none focus:border-bg0/60 text-sm font-medium transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-bg0 bg-red-500/20 border border-red-400/40 px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 text-base font-bold text-bg1 bg-bg0 hover:bg-bg0/90 transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-bg0/20">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-bg0/60 mb-3">
          Demo accounts
        </p>
        <div className="flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <div
              key={a.email}
              className="flex items-center justify-between gap-2 bg-bg0/10 border border-bg0/15 px-3 py-2"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold uppercase text-bg0/70">{a.label}</span>
                <span className="text-sm font-mono text-bg0 truncate">{a.email}</span>
              </div>
              <button
                type="button"
                onClick={() => onFillDemo(a.email)}
                className="shrink-0 px-3 py-1.5 text-xs font-bold text-bg1 bg-bg0 hover:bg-bg0/90 transition-colors"
              >
                Use this
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-bg0/50 mt-3">
          All demo accounts use password <span className="font-mono font-bold">password123</span>.
        </p>
      </div>
    </>
  );
}

function SignedInPanel(props: {
  user: LoggedInUser;
  onSignOut: () => void;
  onHome: () => void;
}) {
  const { user, onSignOut, onHome } = props;
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="w-14 h-14 rounded-full bg-bg0 text-bg1 flex items-center justify-center text-2xl font-extrabold">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">Logged in</h2>
        <p className="text-sm text-bg0/70 mt-1">
          Signed in as <span className="font-bold text-bg0">{user.name}</span> ({user.role})
        </p>
        <p className="text-xs font-mono text-bg0/50 mt-1 break-all">{user.email}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
        <button
          onClick={onHome}
          className="flex-1 py-2.5 text-sm font-bold text-bg1 bg-bg0 hover:bg-bg0/90 transition-colors"
        >
          Go to home
        </button>
        <button
          onClick={onSignOut}
          className="flex-1 py-2.5 text-sm font-bold text-bg0 bg-transparent border-2 border-bg0/60 hover:bg-bg0/10 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

/**
 * MOCK ONLY — F-02 demo without backend.
 * Replace this whole module the day real auth lands; pages/hooks above
 * already follow the shape of a real auth flow.
 */

export type MockRole = "company_admin" | "super_admin";

export type MockAuthUser = {
  id: string;
  email: string;
  password: string;
  role: MockRole;
  fullName: string;
  status: "active" | "disabled";
};

export const MOCK_USERS: MockAuthUser[] = [
  {
    id: "usr_mock_company",
    email: "empresa@licenciame.com",
    password: "demo1234",
    role: "company_admin",
    fullName: "Andrea Restrepo",
    status: "active",
  },
  {
    id: "usr_mock_admin",
    email: "admin@licenciame.com",
    password: "admin1234",
    role: "super_admin",
    fullName: "Camila Soto",
    status: "active",
  },
  {
    id: "usr_mock_disabled",
    email: "disabled@licenciame.com",
    password: "demo1234",
    role: "company_admin",
    fullName: "Cuenta Desactivada",
    status: "disabled",
  },
];

export const MOCK_MFA_CODE = "000000";

export const AUTH_DEMO_RULES = {
  /** Failed credential attempts before locking the account. */
  maxLoginAttempts: 5,
  /** Lockout duration after exceeding maxLoginAttempts (ms). 15 min. */
  lockoutMs: 15 * 60 * 1000,
  /** Cooldown before MFA resend is allowed (s). */
  mfaResendCooldownSeconds: 30,
  /** Lifespan of a sent MFA code (ms). 5 min. */
  mfaCodeTtlMs: 5 * 60 * 1000,
  /** Wrong MFA codes allowed before locking. */
  maxMfaAttempts: 5,
  /** Mock session length (ms). 8h. */
  sessionTtlMs: 8 * 60 * 60 * 1000,
} as const;

export const ROLE_HOME: Record<MockRole, string> = {
  company_admin: "/dashboard03",
  super_admin: "/admin",
};

// ── localStorage helpers (prefix lm_) ───────────────────────────────────────

const SESSION_KEY = "lm_mock_session";
const LOCKOUT_KEY = "lm_auth_lockout";
const ATTEMPTS_KEY = "lm_auth_attempts";
const PENDING_MFA_KEY = "lm_pending_mfa";

export type MockSession = {
  userId: string;
  email: string;
  role: MockRole;
  fullName: string;
  expiresAt: number;
  remember: boolean;
};

export type PendingMfa = {
  userId: string;
  email: string;
  role: MockRole;
  fullName: string;
  remember: boolean;
  issuedAt: number;
  attempts: number;
};

const safeStorage = () => (typeof window === "undefined" ? null : window.localStorage);

export const mockSessionStorage = {
  read(): MockSession | null {
    const s = safeStorage();
    if (!s) return null;
    try {
      const raw = s.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as MockSession;
      if (parsed.expiresAt < Date.now()) {
        s.removeItem(SESSION_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },
  write(session: MockSession) {
    safeStorage()?.setItem(SESSION_KEY, JSON.stringify(session));
  },
  clear() {
    safeStorage()?.removeItem(SESSION_KEY);
  },
};

export const lockoutStorage = {
  isLocked(): { locked: boolean; until?: number } {
    const s = safeStorage();
    if (!s) return { locked: false };
    const raw = s.getItem(LOCKOUT_KEY);
    if (!raw) return { locked: false };
    const until = Number(raw);
    if (!Number.isFinite(until) || until <= Date.now()) {
      s.removeItem(LOCKOUT_KEY);
      s.removeItem(ATTEMPTS_KEY);
      return { locked: false };
    }
    return { locked: true, until };
  },
  registerFailure(): { attempts: number; lockedUntil?: number } {
    const s = safeStorage();
    if (!s) return { attempts: 0 };
    const current = Number(s.getItem(ATTEMPTS_KEY) ?? "0") + 1;
    s.setItem(ATTEMPTS_KEY, String(current));
    if (current >= AUTH_DEMO_RULES.maxLoginAttempts) {
      const until = Date.now() + AUTH_DEMO_RULES.lockoutMs;
      s.setItem(LOCKOUT_KEY, String(until));
      return { attempts: current, lockedUntil: until };
    }
    return { attempts: current };
  },
  reset() {
    const s = safeStorage();
    s?.removeItem(LOCKOUT_KEY);
    s?.removeItem(ATTEMPTS_KEY);
  },
};

export const pendingMfaStorage = {
  read(): PendingMfa | null {
    const s = safeStorage();
    if (!s) return null;
    try {
      const raw = s.getItem(PENDING_MFA_KEY);
      return raw ? (JSON.parse(raw) as PendingMfa) : null;
    } catch {
      return null;
    }
  },
  write(p: PendingMfa) {
    safeStorage()?.setItem(PENDING_MFA_KEY, JSON.stringify(p));
  },
  clear() {
    safeStorage()?.removeItem(PENDING_MFA_KEY);
  },
};

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const head = local.slice(0, 1);
  const tail = local.length > 2 ? local.slice(-1) : "";
  return `${head}${"*".repeat(Math.max(1, local.length - 2))}${tail}@${domain}`;
}

export function findMockUser(email: string): MockAuthUser | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

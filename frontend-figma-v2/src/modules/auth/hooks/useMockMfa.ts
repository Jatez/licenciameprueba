import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUTH_DEMO_RULES,
  MOCK_MFA_CODE,
  lockoutStorage,
  mockSessionStorage,
  pendingMfaStorage,
  type MockSession,
  type PendingMfa,
} from "../mocks/authMockSession";

export type MfaErrorCode = "INVALID_CODE" | "CODE_EXPIRED" | "TOO_MANY_ATTEMPTS" | "INCOMPLETE";

export type MfaVerifyResult =
  | { ok: true; session: MockSession }
  | { ok: false; code: MfaErrorCode };

/**
 * MOCK ONLY — verifies a 6-digit code, manages cooldown for resends and
 * a TTL on the issued code. Real backend will replace with /auth/mfa.
 */
export function useMockMfa(initialPending: PendingMfa | null) {
  const [pending, setPending] = useState<PendingMfa | null>(initialPending);
  const [isPending, setIsPending] = useState(false);
  const [cooldown, setCooldown] = useState<number>(AUTH_DEMO_RULES.mfaResendCooldownSeconds);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [pending?.issuedAt]);

  const verify = useCallback(
    async (code: string): Promise<MfaVerifyResult> => {
      if (!pending) return { ok: false as const, code: "CODE_EXPIRED" };
      if (code.length !== 6) return { ok: false as const, code: "INCOMPLETE" };

      setIsPending(true);
      await new Promise((r) => setTimeout(r, 450));
      try {
        if (Date.now() - pending.issuedAt > AUTH_DEMO_RULES.mfaCodeTtlMs) {
          return { ok: false as const, code: "CODE_EXPIRED" };
        }
        if (code !== MOCK_MFA_CODE) {
          const next = { ...pending, attempts: pending.attempts + 1 };
          if (next.attempts >= AUTH_DEMO_RULES.maxMfaAttempts) {
            pendingMfaStorage.clear();
            lockoutStorage.registerFailure(); // also lock the account
            // Force lock for 15 min explicitly
            window.localStorage.setItem(
              "lm_auth_lockout",
              String(Date.now() + AUTH_DEMO_RULES.lockoutMs),
            );
            return { ok: false as const, code: "TOO_MANY_ATTEMPTS" };
          }
          pendingMfaStorage.write(next);
          setPending(next);
          return { ok: false as const, code: "INVALID_CODE" };
        }

        const session: MockSession = {
          userId: pending.userId,
          email: pending.email,
          role: pending.role,
          fullName: pending.fullName,
          expiresAt: Date.now() + AUTH_DEMO_RULES.sessionTtlMs,
          remember: pending.remember,
        };
        mockSessionStorage.write(session);
        pendingMfaStorage.clear();
        return { ok: true as const, session };
      } finally {
        setIsPending(false);
      }
    },
    [pending],
  );

  const resend = useCallback(async () => {
    if (!pending || cooldown > 0) return;
    await new Promise((r) => setTimeout(r, 250));
    const next = { ...pending, issuedAt: Date.now(), attempts: 0 };
    pendingMfaStorage.write(next);
    setPending(next);
    setCooldown(AUTH_DEMO_RULES.mfaResendCooldownSeconds);
  }, [pending, cooldown]);

  return { pending, verify, resend, cooldown, isPending };
}

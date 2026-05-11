import { useCallback, useState } from "react";
import {
  AUTH_DEMO_RULES,
  findMockUser,
  lockoutStorage,
  pendingMfaStorage,
  type PendingMfa,
} from "../mocks/authMockSession";

export type LoginErrorCode =
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_DISABLED"
  | "ACCOUNT_LOCKED";

export type LoginResult =
  | { ok: true; pending: PendingMfa }
  | { ok: false; code: LoginErrorCode };

/**
 * MOCK ONLY — simulates credential validation with lockout counter.
 * Always requires MFA after a successful credential check (demo).
 */
export function useMockLogin() {
  const [isPending, setIsPending] = useState(false);

  const login = useCallback(
    async (email: string, password: string, remember: boolean): Promise<LoginResult> => {
      setIsPending(true);
      await new Promise((r) => setTimeout(r, 450));
      try {
        const lock = lockoutStorage.isLocked();
        if (lock.locked) return { ok: false as const, code: "ACCOUNT_LOCKED" };

        const user = findMockUser(email);
        if (!user || user.password !== password) {
          const res = lockoutStorage.registerFailure();
          if (res.lockedUntil) return { ok: false as const, code: "ACCOUNT_LOCKED" };
          return { ok: false as const, code: "INVALID_CREDENTIALS" };
        }
        if (user.status === "disabled") {
          return { ok: false as const, code: "ACCOUNT_DISABLED" };
        }

        lockoutStorage.reset();
        const pending: PendingMfa = {
          userId: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          remember,
          issuedAt: Date.now(),
          attempts: 0,
        };
        pendingMfaStorage.write(pending);
        return { ok: true as const, pending };
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { login, isPending, rules: AUTH_DEMO_RULES };
}

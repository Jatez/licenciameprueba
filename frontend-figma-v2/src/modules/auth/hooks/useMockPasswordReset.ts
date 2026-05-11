import { useCallback, useState } from "react";

/**
 * MOCK ONLY — mimics forgot/reset password endpoints with delays.
 * No emails are sent, no credentials persisted.
 */
export function useMockPasswordReset() {
  const [isPending, setIsPending] = useState(false);

  const requestReset = useCallback(async (_email: string): Promise<{ ok: true }> => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsPending(false);
    return { ok: true };
  }, []);

  const updatePassword = useCallback(async (_password: string): Promise<{ ok: true }> => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsPending(false);
    return { ok: true };
  }, []);

  return { requestReset, updatePassword, isPending };
}

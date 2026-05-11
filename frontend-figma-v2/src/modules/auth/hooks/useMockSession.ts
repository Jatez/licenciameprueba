import { useCallback, useEffect, useState } from "react";
import { mockSessionStorage, type MockSession } from "../mocks/authMockSession";

/**
 * MOCK ONLY — exposes the simulated session stored in localStorage.
 * UI-only: never treat as real authentication.
 */
export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(() => mockSessionStorage.read());

  useEffect(() => {
    const onStorage = () => setSession(mockSessionStorage.read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signOut = useCallback(() => {
    mockSessionStorage.clear();
    setSession(null);
  }, []);

  return { session, signOut, refresh: () => setSession(mockSessionStorage.read()) };
}

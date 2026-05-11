import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthTokens } from "@/api/types";

interface AuthStore {
  // Tokens (persisted)
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;

  // UI state for the registration → verification handoff (NOT persisted)
  pendingVerificationEmail: string | null;
  setPendingVerificationEmail: (email: string | null) => void;

  // Full logout
  logout: () => void;
}

/**
 * Server data (the User) lives in React Query under ['auth', 'me'].
 * This store holds only auth tokens + ephemeral UI state.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      pendingVerificationEmail: null,

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),

      clearTokens: () => set({ accessToken: null, refreshToken: null }),

      setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          pendingVerificationEmail: null,
        }),
    }),
    {
      name: "licenciame-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

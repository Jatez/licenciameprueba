import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import * as authApi from "../api";
import type { LoginRequest } from "../api";
import type { RegisterRequest } from "@/api/types";

/**
 * Unified auth surface for the app. No component should access tokens,
 * localStorage or query keys for ['auth'] directly — go through this hook.
 */
export function useAuth() {
  const qc = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setTokens = useAuthStore((s) => s.setTokens);
  const clearStore = useAuthStore((s) => s.logout);

  const userQ = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getCurrentUser,
    enabled: Boolean(accessToken),
    staleTime: 60_000,
  });

  const companyQ = useQuery({
    queryKey: ["auth", "company"],
    queryFn: authApi.getCompany,
    enabled: Boolean(accessToken),
    staleTime: 60_000,
  });

  const loginM = useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (res) => {
      setTokens(res.tokens);
      qc.setQueryData(["auth", "me"], res.user);
      qc.setQueryData(["auth", "company"], res.company);
      // Arrancar el simulador ahora que hay sesión válida
      void import("@/shared/tracking-simulator").then(({ trackingSimulator }) =>
        trackingSimulator.start()
      );
    },
  });

  const registerM = useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: (res) => {
      setTokens(res.tokens);
      qc.setQueryData(["auth", "me"], res.user);
      qc.setQueryData(["auth", "company"], res.company);
    },
  });

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearStore();
      qc.clear();
    }
  }, [clearStore, qc]);

  return {
    user: userQ.data ?? null,
    company: companyQ.data ?? null,
    isAuthenticated: Boolean(accessToken),
    isLoading: userQ.isLoading,
    login: loginM.mutateAsync,
    loginState: loginM,
    register: registerM.mutateAsync,
    registerState: registerM,
    logout,
    loginWithMeta: authApi.loginWithMeta,
    loginWithTikTok: authApi.loginWithTikTok,
  };
}
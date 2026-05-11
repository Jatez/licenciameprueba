import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/api/http";
import { billingApi } from "@/api/endpoints/billing";
import type { BillingProfile } from "@/api/types";

// ─── Current User ────────────────────────────────────────────────────────────

interface CurrentUser {
  id: string;
  email: string;
  role: string;
  companyId: string;
  createdAt: string;
}

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await http.get("/auth/me");
      const d = res.data as Record<string, unknown>;
      return {
        id: d.id as string,
        email: d.email as string,
        role: d.role as string,
        companyId: (d.company_id ?? d.companyId) as string,
        createdAt: (d.created_at ?? d.createdAt) as string,
      };
    },
    staleTime: 60_000,
  });
}

// ─── Company ─────────────────────────────────────────────────────────────────

export function useCompany() {
  return useQuery({
    queryKey: ["auth", "company"],
    queryFn: async () => {
      const res = await http.get("/auth/company");
      return res.data as Record<string, unknown>;
    },
    staleTime: 60_000,
  });
}

// ─── Update Profile ───────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const res = await http.patch("/auth/me", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

// ─── Change Password ──────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: {
      current_password: string;
      new_password: string;
    }) => {
      const res = await http.post("/auth/change-password", payload);
      return res.data;
    },
  });
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export function useBillingProfile() {
  return useQuery<BillingProfile | null>({
    queryKey: ["billing", "profile"],
    queryFn: () => billingApi.getBillingProfile(),
    staleTime: 60_000,
  });
}

export function useSaveBilling() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: BillingProfile) =>
      billingApi.saveBillingProfile(profile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing", "profile"] });
    },
  });
}

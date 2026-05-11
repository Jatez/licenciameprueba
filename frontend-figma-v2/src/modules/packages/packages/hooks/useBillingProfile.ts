import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { BillingProfile } from "@/api/types";

const QK_BILLING = ["billing", "profile"] as const;

export function useBillingProfile() {
  return useQuery({
    queryKey: QK_BILLING,
    queryFn: () => api.billing.getBillingProfile(),
    staleTime: 60_000,
  });
}

export function useSaveBillingProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: BillingProfile) =>
      api.billing.saveBillingProfile(profile),
    onSuccess: (data) => {
      qc.setQueryData(QK_BILLING, data);
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { VerifyEmailResponse } from "@/api";

export function useVerifyEmail(token: string | null) {
  return useQuery<VerifyEmailResponse>({
    queryKey: ["auth", "verifyEmail", token],
    queryFn: () => api.auth.verifyEmail({ token: token ?? "" }),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    gcTime: 0,
  });
}

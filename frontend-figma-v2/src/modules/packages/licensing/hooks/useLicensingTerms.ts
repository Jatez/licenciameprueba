import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { LicensingTermsResponse } from "@/api/types";

export const LICENSING_TERMS_KEY = ["licensing", "terms"] as const;

export function useLicensingTerms() {
  return useQuery<LicensingTermsResponse>({
    queryKey: LICENSING_TERMS_KEY,
    queryFn: () => api.licensing.getLicensingTerms(),
    staleTime: 5 * 60_000,
  });
}

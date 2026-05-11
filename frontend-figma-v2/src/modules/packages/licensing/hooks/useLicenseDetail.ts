import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { License } from "@/api/types";

export const LICENSE_DETAIL_KEY = (id: string | undefined) =>
  ["licenses", "detail", id] as const;

export function useLicenseDetail(licenseId: string | undefined) {
  return useQuery<License>({
    queryKey: LICENSE_DETAIL_KEY(licenseId),
    queryFn: () => api.licensing.getLicenseById(licenseId!),
    enabled: !!licenseId,
    staleTime: 60_000,
  });
}

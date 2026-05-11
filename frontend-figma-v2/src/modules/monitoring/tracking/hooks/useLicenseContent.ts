import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { LicenseAssociatedContent } from "@/api/types";

export function useLicenseContent(licenseId: string | null | undefined) {
  return useQuery<LicenseAssociatedContent>({
    queryKey: ["license-content", licenseId],
    queryFn: () => api.tracking.getLicenseAssociatedContent(licenseId as string),
    enabled: !!licenseId,
    staleTime: 30_000,
  });
}

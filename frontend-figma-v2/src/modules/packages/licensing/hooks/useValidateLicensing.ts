import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { LicenseUsageType, LicensingValidationResponse } from "@/api/types";

export function useValidateLicensing(
  trackId: string | null,
  usageType: LicenseUsageType | null,
) {
  return useQuery<LicensingValidationResponse>({
    queryKey: ["licensing", "validate", trackId, usageType],
    queryFn: () =>
      api.licensing.validateLicensing({
        trackId: trackId!,
        usageType: usageType!,
      }),
    enabled: !!trackId && !!usageType,
    staleTime: 30_000,
    retry: 1,
  });
}

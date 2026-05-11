import type { LicenseUsageType, PlatformLicensability } from "@/api/types";

/**
 * A usage type is allowed for the track if at least one of its platforms
 * supports it. Pure helper — mirrors backend rule.
 */
export function isUsageTypeAllowed(
  platformLicensability: PlatformLicensability[],
  usageType: LicenseUsageType,
): boolean {
  return platformLicensability.some(
    (p) => p.allowed && p.allowedUsageTypes.includes(usageType),
  );
}

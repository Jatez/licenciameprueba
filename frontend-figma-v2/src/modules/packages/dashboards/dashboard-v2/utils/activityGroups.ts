import type { ActivityType } from "@/api/types.dashboard";

export type ActivityGroupKey = "all" | "licenses" | "payments" | "publications";

/**
 * Maps the granular ActivityType (15 sub-types) into the 3 UI-facing groups.
 * Backend keeps full granularity; this is purely presentational.
 */
export const activityGroupByType: Record<ActivityType, Exclude<ActivityGroupKey, "all">> = {
  "license-issued": "licenses",
  "license-cancelled": "licenses",
  "license-needs-review": "licenses",
  "license-consumed-by-post": "licenses",
  "credits-purchased": "payments",
  "low-balance-alert": "payments",
  "bag-expiring-alert": "payments",
  "post-detected": "publications",
  "post-matched-auto": "publications",
  "post-matched-manual": "publications",
  "post-unlinked": "publications",
  "evidence-expired": "publications",
  "no-match-found": "publications",
  "social-account-connected": "publications",
  "sync-error": "publications",
};

export function matchesActivityGroup(type: ActivityType, group: ActivityGroupKey): boolean {
  if (group === "all") return true;
  return activityGroupByType[type] === group;
}

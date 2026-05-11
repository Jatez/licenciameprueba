import type { UserActivity } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../strings";

export interface UserActivityMomentGroup {
  key: "seconds" | "today" | "yesterday" | "thisWeek" | "earlier";
  label: string;
  representativeTimestamp: string;
  items: UserActivity[];
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function bucketFor(iso: string): UserActivityMomentGroup["key"] {
  const ts = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = (now - ts) / 1000;
  if (diffSec < 60) return "seconds";

  const today = startOfDay(new Date(now));
  const day = startOfDay(new Date(ts));
  const dayDiff = Math.round((today - day) / 86_400_000);
  if (dayDiff <= 0) return "today";
  if (dayDiff === 1) return "yesterday";
  if (dayDiff <= 7) return "thisWeek";
  return "earlier";
}

const ORDER: UserActivityMomentGroup["key"][] = [
  "seconds",
  "today",
  "yesterday",
  "thisWeek",
  "earlier",
];

/**
 * Buckets user activity into temporal groups: "hace unos segundos", "hoy",
 * "ayer", "esta semana", "anterior". Items keep their input order inside
 * each bucket (expected: most recent first).
 */
export function groupUserActivityByMoment(items: UserActivity[]): UserActivityMomentGroup[] {
  const labels = dashboardV2Strings.recentActivity.groupLabels;
  const buckets = new Map<UserActivityMomentGroup["key"], UserActivity[]>();

  for (const item of items) {
    const key = bucketFor(item.created_at);
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }

  return ORDER.filter((k) => buckets.has(k)).map((key) => {
    const list = buckets.get(key)!;
    return {
      key,
      label: labels[key],
      representativeTimestamp: list[0].created_at,
      items: list,
    };
  });
}
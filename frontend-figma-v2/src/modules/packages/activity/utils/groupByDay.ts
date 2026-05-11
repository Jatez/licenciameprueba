import type { UserActivity } from "@/api/types.dashboard";
import { activityStrings } from "../strings";

const dayFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "short",
});

export interface ActivityDayGroup {
  key: string;
  label: string;
  representativeTimestamp: string;
  items: UserActivity[];
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function groupActivityByDay(items: UserActivity[]): ActivityDayGroup[] {
  if (!items.length) return [];
  const today = startOfDay(new Date());
  const map = new Map<number, UserActivity[]>();
  for (const item of items) {
    const key = startOfDay(new Date(item.created_at));
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }

  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([ts, list]) => {
      const offset = Math.round((today - ts) / 86_400_000);
      let label = dayFormatter.format(new Date(ts));
      if (offset === 0) label = activityStrings.groupLabels.today;
      else if (offset === 1) label = activityStrings.groupLabels.yesterday;
      return {
        key: String(ts),
        label,
        representativeTimestamp: list[0].created_at,
        items: list,
      };
    });
}
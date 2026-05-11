import type { ActivityItem } from "@/api/types.dashboard";
import { dashboardV2Strings } from "../strings";

const dayFormatter = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short" });

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function labelForDayOffset(offset: number, ts: number): string {
  const t = dashboardV2Strings.recentActivity.groupLabels;
  if (offset === 0) return t.today;
  if (offset === 1) return t.yesterday;
  return dayFormatter.format(new Date(ts)).toLowerCase();
}

export interface ActivityGroup {
  key: string;
  label: string;
  items: ActivityItem[];
}

/** Groups activity items by calendar day; returns ordered groups newest → oldest. */
export function groupActivityByDay(items: ActivityItem[]): ActivityGroup[] {
  if (!items.length) return [];
  const today = startOfDay(new Date());
  const map = new Map<number, ActivityItem[]>();

  for (const item of items) {
    const key = startOfDay(new Date(item.timestamp));
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }

  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([ts, list]) => {
      const offsetDays = Math.round((today - ts) / 86_400_000);
      return {
        key: String(ts),
        label: labelForDayOffset(offsetDays, ts),
        items: list,
      };
    });
}

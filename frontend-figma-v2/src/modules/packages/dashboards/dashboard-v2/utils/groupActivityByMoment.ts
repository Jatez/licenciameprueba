import type { ActivityItem } from "@/api/types.dashboard";

export interface ActivityMomentGroup {
  key: string;
  label: string;
  representativeTimestamp: string;
  items: ActivityItem[];
}

/**
 * Groups consecutive activity items that share the same relative-time label.
 * Preserves input order (expected: most recent first).
 */
export function groupActivityByMoment(
  items: ActivityItem[],
  formatRelative: (iso: string) => string,
): ActivityMomentGroup[] {
  const groups: ActivityMomentGroup[] = [];

  for (const item of items) {
    const label = formatRelative(item.timestamp);
    const last = groups[groups.length - 1];

    if (last && last.label === label) {
      last.items.push(item);
      continue;
    }

    groups.push({
      key: `${label}-${item.id}`,
      label,
      representativeTimestamp: item.timestamp,
      items: [item],
    });
  }

  return groups;
}

export function firstActionRoute(items: ActivityItem[]): string | undefined {
  return items.find((i) => i.actionRoute)?.actionRoute;
}

export function firstActionLabel(items: ActivityItem[]): string | undefined {
  return items.find((i) => i.actionRoute)?.actionLabel;
}

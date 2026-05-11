/**
 * Date-range preset → ISO {from,to} resolver for the monitoring feed.
 * "custom" returns nulls — caller is responsible for picking dates.
 */
import type { TrackingDateRangePreset } from "@/api/types";

export function resolveDateRangePreset(
  preset: TrackingDateRangePreset,
): { from: string | null; to: string | null } {
  if (preset === "custom") return { from: null, to: null };

  const now = new Date();
  const to = now.toISOString();
  const from = new Date(now);

  switch (preset) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "last7":
      from.setDate(from.getDate() - 7);
      break;
    case "last30":
      from.setDate(from.getDate() - 30);
      break;
    case "last90":
      from.setDate(from.getDate() - 90);
      break;
  }

  return { from: from.toISOString(), to };
}

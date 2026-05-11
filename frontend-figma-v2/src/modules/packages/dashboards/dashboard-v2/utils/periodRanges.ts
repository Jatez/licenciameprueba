import type { DashboardPeriod, DashboardPeriodRange } from "@/api/types.dashboard";

export function periodToDays(p: DashboardPeriod): number {
  switch (p) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "ytd": {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return Math.max(1, Math.floor((now.getTime() - start.getTime()) / 86_400_000));
    }
    case "custom":
      return 30;
  }
}

export function buildRange(preset: DashboardPeriod): DashboardPeriodRange {
  const days = periodToDays(preset);
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  const comparedTo = new Date(from);
  const comparedFrom = new Date(from);
  comparedFrom.setDate(comparedFrom.getDate() - days);
  return {
    preset,
    from: from.toISOString(),
    to: to.toISOString(),
    comparedFrom: comparedFrom.toISOString(),
    comparedTo: comparedTo.toISOString(),
  };
}

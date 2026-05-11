/**
 * F-11 · Period preset → ISO range resolver.
 * Pure: no side effects. Date "now" injected for testability.
 */
import type { PeriodPreset } from "../types";

export interface ResolvedPeriod {
  start: string; // ISO
  end: string;   // ISO
  /** Same-length window immediately preceding [start,end). */
  comparisonStart: string;
  comparisonEnd: string;
}

export function resolvePeriod(
  preset: PeriodPreset,
  customRange?: { start: string; end: string },
  now: Date = new Date(),
): ResolvedPeriod {
  const end = new Date(now);
  let start = new Date(now);

  switch (preset) {
    case "last_7_days":
      start.setDate(end.getDate() - 7);
      break;
    case "last_30_days":
      start.setDate(end.getDate() - 30);
      break;
    case "last_90_days":
      start.setDate(end.getDate() - 90);
      break;
    case "this_month":
      start = new Date(end.getFullYear(), end.getMonth(), 1, 0, 0, 0, 0);
      break;
    case "last_month": {
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1, 0, 0, 0, 0);
      const monthEnd = new Date(end.getFullYear(), end.getMonth(), 0, 23, 59, 59, 999);
      return makeResolved(start, monthEnd);
    }
    case "custom":
      if (!customRange) throw new Error("customRange required when period=custom");
      return makeResolved(new Date(customRange.start), new Date(customRange.end));
  }

  return makeResolved(start, end);
}

function makeResolved(start: Date, end: Date): ResolvedPeriod {
  const lengthMs = end.getTime() - start.getTime();
  const comparisonEnd = new Date(start.getTime() - 1);
  const comparisonStart = new Date(comparisonEnd.getTime() - lengthMs);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    comparisonStart: comparisonStart.toISOString(),
    comparisonEnd: comparisonEnd.toISOString(),
  };
}

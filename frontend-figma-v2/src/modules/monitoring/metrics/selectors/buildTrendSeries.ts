/**
 * F-11 · Pure: bucketize publications into a daily (or weekly) trend series.
 * Day granularity for windows ≤60 days, week granularity above.
 */
import type { PublicationMetric } from "../types";
import { resolvePeriod } from "../selectors/resolvePeriod";
import type { MetricsFilter } from "../types";
import { publicationInteractions } from "../selectors/computeEngagement";

export interface TrendPoint {
  /** ISO date at start of bucket. */
  bucketStart: string;
  /** Human label e.g. "27 abr" or "Sem 17". */
  label: string;
  publications: number;
  views: number;
  interactions: number;
}

const DAY_MS = 86_400_000;

export function buildTrendSeries(
  publications: readonly PublicationMetric[],
  filter: MetricsFilter,
): { points: TrendPoint[]; granularity: "day" | "week" } {
  const period = resolvePeriod(filter.period, filter.customRange);
  const startMs = Date.parse(period.start);
  const endMs = Date.parse(period.end);
  const spanDays = Math.max(1, Math.ceil((endMs - startMs) / DAY_MS));
  const granularity: "day" | "week" = spanDays > 60 ? "week" : "day";
  const bucketMs = granularity === "week" ? DAY_MS * 7 : DAY_MS;
  const buckets = Math.max(1, Math.ceil((endMs - startMs) / bucketMs));

  const points: TrendPoint[] = Array.from({ length: buckets }, (_, i) => {
    const bStart = startMs + i * bucketMs;
    const d = new Date(bStart);
    const label =
      granularity === "week"
        ? `Sem ${getIsoWeek(d)}`
        : d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
    return { bucketStart: new Date(bStart).toISOString(), label, publications: 0, views: 0, interactions: 0 };
  });

  for (const p of publications) {
    const ts = Date.parse(p.publishedAt);
    if (ts < startMs || ts > endMs) continue;
    const idx = Math.min(buckets - 1, Math.floor((ts - startMs) / bucketMs));
    const b = points[idx];
    b.publications += 1;
    b.views += p.views;
    b.interactions += publicationInteractions(p);
  }

  return { points, granularity };
}

function getIsoWeek(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const diff = target.valueOf() - firstThursday.valueOf();
  return 1 + Math.round(diff / (DAY_MS * 7));
}

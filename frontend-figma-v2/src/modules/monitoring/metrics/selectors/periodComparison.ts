/**
 * F-11 · Pure: percentage delta between current and previous overview.
 *
 * Convention:
 *  - Returns delta in %, 2 decimals, signed.
 *  - If previous = 0 and current > 0 → null (cannot represent ∞).
 *  - If both are 0 → null.
 */
import type { MetricsDeltas, MetricsOverview } from "../types";

export function computePeriodComparison(
  current: MetricsOverview,
  previous: MetricsOverview,
): MetricsDeltas {
  return {
    publications: pct(current.totals.publications, previous.totals.publications),
    views: pct(current.totals.views, previous.totals.views),
    interactions: pct(current.totals.interactions, previous.totals.interactions),
    engagementRate: pct(current.totals.engagementRate, previous.totals.engagementRate),
    creditsSpent: pct(current.totals.creditsSpent, previous.totals.creditsSpent),
  };
}

function pct(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}

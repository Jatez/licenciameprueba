/**
 * F-11 · Pure: credits aggregated by license use type.
 * Returns array sorted desc by creditsSpent.
 */
import type { CreditsByUseType, LicenseUseType, PublicationMetric } from "../types";
import { useTypeLabels } from "../strings";

export function computeCreditsByUseType(
  publications: readonly PublicationMetric[],
): CreditsByUseType[] {
  if (publications.length === 0) return [];

  const buckets = new Map<LicenseUseType, { count: number; credits: number }>();
  let totalCredits = 0;

  for (const p of publications) {
    const b = buckets.get(p.licenseUseType) ?? { count: 0, credits: 0 };
    b.count += 1;
    b.credits += p.creditsSpent;
    totalCredits += p.creditsSpent;
    buckets.set(p.licenseUseType, b);
  }

  return Array.from(buckets.entries())
    .map(([useType, b]) => ({
      useType,
      label: useTypeLabels[useType],
      count: b.count,
      creditsSpent: b.credits,
      percentageOfTotal:
        totalCredits === 0 ? 0 : Math.round((b.credits / totalCredits) * 10000) / 100,
    }))
    .sort((a, b) => b.creditsSpent - a.creditsSpent);
}

/**
 * F-11 · Pure: filter publications by all criteria.
 * Returns a new array sorted by publishedAt desc.
 */
import type { MetricsFilter, PublicationMetric } from "../types";
import { resolvePeriod } from "./resolvePeriod";

export interface FilterPublicationsOptions {
  /** Override "now" for tests. */
  now?: Date;
}

export function filterPublications(
  publications: readonly PublicationMetric[],
  filter: MetricsFilter,
  options: FilterPublicationsOptions = {},
): PublicationMetric[] {
  const period = resolvePeriod(filter.period, filter.customRange, options.now);
  const startMs = Date.parse(period.start);
  const endMs = Date.parse(period.end);

  const platformSet = new Set(filter.platforms);
  const useTypeSet = new Set(filter.useTypes);

  const result = publications.filter((p) => {
    const ts = Date.parse(p.publishedAt);
    if (ts < startMs || ts > endMs) return false;
    if (platformSet.size > 0 && !platformSet.has(p.platform)) return false;
    if (useTypeSet.size > 0 && !useTypeSet.has(p.licenseUseType)) return false;
    if (filter.trackId && p.trackId !== filter.trackId) return false;

    switch (filter.syncStatusFilter) {
      case "synced_only":
        if (p.syncStatus !== "synced") return false;
        break;
      case "with_issues":
        if (p.syncStatus !== "partial" && p.syncStatus !== "failed") return false;
        break;
      case "all":
      default:
        break;
    }
    return true;
  });

  result.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return result;
}

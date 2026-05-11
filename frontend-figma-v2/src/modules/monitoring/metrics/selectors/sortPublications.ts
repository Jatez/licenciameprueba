/**
 * F-11 · Pure: in-memory sort for the publications table.
 * Keys map to PublicationMetric fields. Engagement is derived.
 */
import type { PublicationMetric } from "../types";
import { publicationEngagementRate } from "../selectors/computeEngagement";

export type PublicationSortKey =
  | "publishedAt"
  | "platform"
  | "useType"
  | "views"
  | "interactions"
  | "engagement"
  | "status";

export type SortDirection = "asc" | "desc";

export function sortPublications(
  rows: readonly PublicationMetric[],
  key: PublicationSortKey,
  direction: SortDirection,
): PublicationMetric[] {
  const dir = direction === "asc" ? 1 : -1;
  const out = rows.slice();
  out.sort((a, b) => dir * compare(a, b, key));
  return out;
}

function compare(a: PublicationMetric, b: PublicationMetric, key: PublicationSortKey): number {
  switch (key) {
    case "publishedAt":
      return Date.parse(a.publishedAt) - Date.parse(b.publishedAt);
    case "platform":
      return a.platform.localeCompare(b.platform);
    case "useType":
      return a.licenseUseType.localeCompare(b.licenseUseType);
    case "views":
      return a.views - b.views;
    case "interactions":
      return interactions(a) - interactions(b);
    case "engagement":
      return publicationEngagementRate(a) - publicationEngagementRate(b);
    case "status":
      return a.syncStatus.localeCompare(b.syncStatus);
  }
}

function interactions(p: PublicationMetric): number {
  return p.likes + p.comments + p.shares + p.saves;
}

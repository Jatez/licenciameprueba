/**
 * F-11 · Pure: engagement helpers.
 * Centralised so UI never re-derives the formula.
 */
import type { PublicationMetric } from "../types";

export function publicationInteractions(p: PublicationMetric): number {
  return p.likes + p.comments + p.shares + p.saves;
}

export function publicationEngagementRate(p: PublicationMetric): number {
  if (p.views === 0) return 0;
  return Math.round((publicationInteractions(p) / p.views) * 10000) / 100;
}

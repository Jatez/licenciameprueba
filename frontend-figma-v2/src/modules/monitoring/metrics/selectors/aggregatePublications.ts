/**
 * F-11 · Pure: aggregate publications into a MetricsOverview.
 *
 * Engagement rate convention: (interactions / views) * 100 with 2 decimals.
 * If views = 0 → engagementRate = 0 (never NaN, never null).
 */
import type {
  DataHealth,
  MetricsOverview,
  PlatformBreakdownEntry,
  PublicationMetric,
  SocialPlatform,
} from "../types";

const PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook"];
const STALE_THRESHOLD_MS = 3 * 60 * 60 * 1000; // 3h

export function aggregatePublications(
  publications: readonly PublicationMetric[],
  periodStart: string,
  periodEnd: string,
  comparisonPeriodStart: string,
  comparisonPeriodEnd: string,
  lastGlobalSyncAt: string,
): MetricsOverview {
  const totals = sumPublications(publications);
  const byPlatform = computeByPlatform(publications);
  const dataHealth = computeDataHealth(publications, lastGlobalSyncAt);

  return {
    periodStart,
    periodEnd,
    comparisonPeriodStart,
    comparisonPeriodEnd,
    totals,
    deltas: { publications: null, views: null, interactions: null, engagementRate: null, creditsSpent: null },
    byPlatform,
    dataHealth,
  };
}

export function sumPublications(publications: readonly PublicationMetric[]) {
  let views = 0, likes = 0, comments = 0, shares = 0, saves = 0, credits = 0;
  for (const p of publications) {
    views += p.views;
    likes += p.likes;
    comments += p.comments;
    shares += p.shares;
    saves += p.saves;
    credits += p.creditsSpent;
  }
  const interactions = likes + comments + shares + saves;
  const engagementRate = views === 0 ? 0 : roundTwo((interactions / views) * 100);
  return {
    publications: publications.length,
    views,
    interactions,
    engagementRate,
    creditsSpent: credits,
  };
}

function computeByPlatform(publications: readonly PublicationMetric[]): PlatformBreakdownEntry[] {
  return PLATFORMS.map((platform) => {
    const subset = publications.filter((p) => p.platform === platform);
    const t = sumPublications(subset);
    return {
      platform,
      publications: t.publications,
      views: t.views,
      interactions: t.interactions,
      engagementRate: t.engagementRate,
    };
  });
}

function computeDataHealth(
  publications: readonly PublicationMetric[],
  lastGlobalSyncAt: string,
): DataHealth {
  let synced = 0, partial = 0, failed = 0;
  for (const p of publications) {
    if (p.syncStatus === "synced") synced++;
    else if (p.syncStatus === "partial") partial++;
    else if (p.syncStatus === "failed") failed++;
  }
  const ageMs = Date.now() - Date.parse(lastGlobalSyncAt);
  return {
    totalExpected: publications.length,
    totalSynced: synced,
    totalPartial: partial,
    totalFailed: failed,
    lastGlobalSyncAt,
    isStale: ageMs > STALE_THRESHOLD_MS,
  };
}

function roundTwo(n: number): number {
  return Math.round(n * 100) / 100;
}

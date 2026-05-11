/**
 * F-11 · Pure: rank publications by track and emit MetricsTopTrack[].
 *
 * Default sort key is "views" (the user-facing "reproducciones"). Other keys
 * unlock alternative leaderboards exposed in the UI.
 */
import type { MetricsTopTrack, PublicationMetric, SocialPlatform } from "../types";

export type TopTrackSortKey =
  | "views"
  | "interactions"
  | "engagement"
  | "publications";

export function computeTopTracks(
  publications: readonly PublicationMetric[],
  limit = 12,
  sortKey: TopTrackSortKey = "views",
): MetricsTopTrack[] {
  if (publications.length === 0) return [];

  type Bucket = {
    trackId: string;
    trackTitle: string;
    trackArtist: string;
    trackCoverUrl: string;
    totalPublications: number;
    totalViews: number;
    totalInteractions: number;
    byPlatform: Record<SocialPlatform, number>;
  };

  const map = new Map<string, Bucket>();
  for (const p of publications) {
    let b = map.get(p.trackId);
    if (!b) {
      b = {
        trackId: p.trackId,
        trackTitle: p.trackTitle,
        trackArtist: p.trackArtist,
        trackCoverUrl: p.trackCoverUrl,
        totalPublications: 0,
        totalViews: 0,
        totalInteractions: 0,
        byPlatform: { instagram: 0, tiktok: 0, facebook: 0 },
      };
      map.set(p.trackId, b);
    }
    b.totalPublications += 1;
    b.totalViews += p.views;
    b.totalInteractions += p.likes + p.comments + p.shares + p.saves;
    b.byPlatform[p.platform] += 1;
  }

  const buckets = Array.from(map.values()).map((b) => ({
    ...b,
    engagementRate:
      b.totalViews === 0
        ? 0
        : Math.round((b.totalInteractions / b.totalViews) * 10000) / 100,
  }));

  const sorters: Record<TopTrackSortKey, (a: typeof buckets[number], b: typeof buckets[number]) => number> = {
    views: (a, b) => b.totalViews - a.totalViews,
    interactions: (a, b) => b.totalInteractions - a.totalInteractions,
    engagement: (a, b) => b.engagementRate - a.engagementRate,
    publications: (a, b) => b.totalPublications - a.totalPublications,
  };

  return buckets
    .sort(sorters[sortKey])
    .slice(0, limit)
    .map((b, i) => ({
      rank: i + 1,
      trackId: b.trackId,
      trackTitle: b.trackTitle,
      trackArtist: b.trackArtist,
      trackCoverUrl: b.trackCoverUrl,
      totalPublications: b.totalPublications,
      totalViews: b.totalViews,
      totalInteractions: b.totalInteractions,
      engagementRate: b.engagementRate,
      byPlatform: b.byPlatform,
    }));
}

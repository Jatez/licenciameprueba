/**
 * Seed detected posts so the monitoring feed isn't empty on first load.
 *
 * Distribution (6 posts spread across last 7 days):
 *  - 3 matched-auto against active licenses
 *  - 1 pending-match (no licenseId yet)
 *  - 1 no-match-found
 *  - 1 matched-manual
 */
import type { DetectedPost, License } from "@/api/types";
import { generateDetectedPost, buildTrackPoolFromLicenses } from "./postGenerator";
import { attemptMatch } from "./matchingEngine";

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function buildSeedPosts(licenses: License[]): DetectedPost[] {
  const trackPool = buildTrackPoolFromLicenses(licenses);
  if (!trackPool.length) return [];

  const seeds: DetectedPost[] = [];
  const activeLicenses = licenses.filter((l) => l.status === "active");

  // 3 matched-auto
  for (let i = 0; i < 3 && i < activeLicenses.length; i += 1) {
    const license = activeLicenses[i];
    const post = generateDetectedPost({
      trackOptions: [
        {
          trackId: license.trackId,
          title: license.trackSnapshot.title,
          artist: license.trackSnapshot.artist,
          coverUrl: license.trackSnapshot.coverUrl,
        },
      ],
      platform: i === 0 ? "instagram" : i === 1 ? "tiktok" : "facebook",
      postType: i === 0 ? "reel" : i === 1 ? "tiktok-video" : "facebook-post",
      publishedAt: daysAgo(i + 1),
    });
    const result = attemptMatch(post, [license]);
    seeds.push({
      ...post,
      licenseId: result.licenseId,
      matchStatus: "matched-auto",
      matchMethod: result.matchMethod,
      matchConfidence: result.confidence,
      metrics: {
        impressions: 1200 + i * 800,
        reproductions: 800 + i * 400,
        likes: 150 + i * 50,
        comments: 12 + i * 5,
        shares: 4 + i,
        saves: 8 + i * 2,
        lastUpdatedAt: new Date().toISOString(),
      },
    });
  }

  // 1 pending-match
  seeds.push({
    ...generateDetectedPost({
      trackOptions: trackPool,
      platform: "instagram",
      postType: "feed-post",
      publishedAt: daysAgo(4),
    }),
    matchStatus: "pending-match",
  });

  // 1 no-match-found
  seeds.push({
    ...generateDetectedPost({
      trackOptions: trackPool,
      platform: "instagram",
      postType: "story",
      publishedAt: daysAgo(5),
    }),
    matchStatus: "no-match-found",
  });

  // 1 matched-manual (use last active license)
  if (activeLicenses.length) {
    const license = activeLicenses[activeLicenses.length - 1];
    const post = generateDetectedPost({
      trackOptions: [
        {
          trackId: license.trackId,
          title: license.trackSnapshot.title,
          artist: license.trackSnapshot.artist,
          coverUrl: license.trackSnapshot.coverUrl,
        },
      ],
      platform: "tiktok",
      postType: "tiktok-video",
      publishedAt: daysAgo(6),
    });
    seeds.push({
      ...post,
      licenseId: license.id,
      matchStatus: "matched-manual",
      matchMethod: "manual",
      matchConfidence: 1,
      linkedByUserId: "user-mock-001",
      linkedAt: daysAgo(6),
      metrics: {
        impressions: 4500,
        reproductions: 3100,
        likes: 320,
        comments: 28,
        shares: 14,
        saves: 19,
        lastUpdatedAt: new Date().toISOString(),
      },
    });
  }

  return seeds;
}

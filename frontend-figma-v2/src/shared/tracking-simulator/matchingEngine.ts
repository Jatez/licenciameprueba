/**
 * Matching engine — placeholder logic.
 *
 * Backend hand-off: this is a deterministic stub. The real implementation will
 * likely use ML / fuzzy matching against canonical fingerprints. The PUBLIC
 * SHAPE of `attemptMatch()` should remain stable so the UI doesn't change.
 *
 * Rules (MVP):
 *  - Permanent posts (reel, feed-post, tiktok-video, facebook-post)
 *      → STRICT: match by ISRC or trackId, oldest active license wins.
 *      → confidence 1.0, method 'isrc' | 'track-id'.
 *  - Stories (ephemeral)
 *      → FLEXIBLE: trackId + ±2h window vs license.issuedAt.
 *      → confidence ~0.7, method 'time-window'.
 *      → prefers usageType 'stories-pack' > 'single-use' > rest.
 *  - 'monthly-extended' licenses do NOT consume on first match. Multiple posts
 *    can match the same license during its 30-day window.
 */
import type { DetectedPost, License } from "@/api/types";
import type { MatchResult } from "./trackingSimulator.types";

const STORY_TIME_WINDOW_MS = 2 * 60 * 60 * 1000; // ±2h

type MatchablePost = Omit<
  DetectedPost,
  "licenseId" | "matchStatus" | "matchMethod" | "matchConfidence"
>;

export function attemptMatch(
  post: MatchablePost,
  activeLicenses: License[],
): MatchResult {
  if (!activeLicenses.length) return noMatch();

  const trackId = post.snapshot.detectedTrackId;
  // monthly-extended licenses are eligible regardless of consumed status as long
  // as they're still in their active 30-day window.
  const eligible = activeLicenses.filter((l) => isLicenseEligible(l, post));

  if (!eligible.length) return noMatch();

  if (post.postType === "story") {
    return matchFlexibleStory(post, eligible);
  }
  return matchStrictPermanent(post, eligible);
}

function isLicenseEligible(license: License, post: MatchablePost): boolean {
  if (license.status === "cancelled" || license.status === "expired") return false;
  // For monthly-extended, status may be 'active' or 'consumed' in the simulator
  // but we still consider it open until expiresAt.
  if (license.usageType === "monthly-extended") {
    if (!license.expiresAt) return license.status === "active";
    return new Date(license.expiresAt).getTime() >= new Date(post.publishedAt).getTime();
  }
  return license.status === "active";
}

function matchStrictPermanent(post: MatchablePost, eligible: License[]): MatchResult {
  const trackId = post.snapshot.detectedTrackId;
  const isrc = findIsrcInLicensesForTrack(eligible, trackId);

  // ISRC match
  if (isrc) {
    const candidates = eligible.filter(
      (l) => l.trackSnapshot.isrc === isrc && l.trackId === trackId,
    );
    if (candidates.length) {
      const winner = pickOldest(candidates);
      return { matched: true, licenseId: winner.id, matchMethod: "isrc", confidence: 1 };
    }
  }

  // Track-id fallback
  const byTrackId = eligible.filter((l) => l.trackId === trackId);
  if (byTrackId.length) {
    const winner = pickOldest(byTrackId);
    return { matched: true, licenseId: winner.id, matchMethod: "track-id", confidence: 1 };
  }

  return noMatch();
}

function matchFlexibleStory(post: MatchablePost, eligible: License[]): MatchResult {
  const trackId = post.snapshot.detectedTrackId;
  const publishedMs = new Date(post.publishedAt).getTime();

  const sameTrack = eligible.filter((l) => l.trackId === trackId);
  if (!sameTrack.length) return noMatch();

  const inWindow = sameTrack.filter((l) => {
    const issuedMs = new Date(l.issuedAt).getTime();
    return Math.abs(publishedMs - issuedMs) <= STORY_TIME_WINDOW_MS;
  });

  // Story can fall back to any same-track active license if no time-window hit,
  // but with reduced confidence.
  const pool = inWindow.length ? inWindow : sameTrack;

  pool.sort((a, b) => storyPreferenceRank(a) - storyPreferenceRank(b));
  const winner = pool[0];
  return {
    matched: true,
    licenseId: winner.id,
    matchMethod: "time-window",
    confidence: inWindow.length ? 0.7 : 0.5,
  };
}

function storyPreferenceRank(l: License): number {
  switch (l.usageType) {
    case "stories-pack":
      return 0;
    case "single-use":
      return 1;
    case "monthly-extended":
      return 2;
    case "paid-post":
      return 3;
    case "collaborative-post":
      return 4;
    case "long-video":
      return 5;
    default:
      return 6;
  }
}

function pickOldest(licenses: License[]): License {
  return licenses.reduce((oldest, current) =>
    new Date(current.issuedAt).getTime() < new Date(oldest.issuedAt).getTime()
      ? current
      : oldest,
  );
}

function findIsrcInLicensesForTrack(licenses: License[], trackId: string): string | null {
  for (const l of licenses) {
    if (l.trackId === trackId && l.trackSnapshot.isrc) return l.trackSnapshot.isrc;
  }
  return null;
}

function noMatch(): MatchResult {
  return { matched: false, licenseId: null, matchMethod: null, confidence: null };
}

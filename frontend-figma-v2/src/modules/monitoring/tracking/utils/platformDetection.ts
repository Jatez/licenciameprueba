/**
 * Detect platform + post type from a public social URL.
 * Used by the manual link dialog to auto-populate fields.
 */
import type { PostType, SocialPlatformF06 } from "@/api/types";

export interface PlatformDetectionResult {
  platform: SocialPlatformF06 | null;
  postType: PostType | null;
}

const INSTAGRAM_RE = /instagram\.com\/(reels?|p|stories)\//i;
const TIKTOK_RE = /tiktok\.com\/@[^/]+\/video\//i;
const FACEBOOK_RE = /(facebook\.com|fb\.watch)/i;

export function detectFromUrl(url: string): PlatformDetectionResult {
  const trimmed = url.trim();
  if (!trimmed) return { platform: null, postType: null };

  const ig = trimmed.match(INSTAGRAM_RE);
  if (ig) {
    const seg = ig[1].toLowerCase();
    let postType: PostType = "feed-post";
    if (seg.startsWith("reel")) postType = "reel";
    else if (seg === "stories") postType = "story";
    return { platform: "instagram", postType };
  }

  if (TIKTOK_RE.test(trimmed)) {
    return { platform: "tiktok", postType: "tiktok-video" };
  }

  if (FACEBOOK_RE.test(trimmed)) {
    return { platform: "facebook", postType: "facebook-post" };
  }

  return { platform: null, postType: null };
}

export function isSupportedPlatformUrl(url: string): boolean {
  return INSTAGRAM_RE.test(url) || TIKTOK_RE.test(url) || FACEBOOK_RE.test(url);
}

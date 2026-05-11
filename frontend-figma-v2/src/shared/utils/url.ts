/**
 * Helpers to build profile / post URLs for supported social platforms.
 */
import type { SocialPlatform } from "@/api/types";

export function profileUrl(platform: SocialPlatform, handle: string): string {
  const h = handle.replace(/^@/, "");
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${h}`;
    case "tiktok":
      return `https://tiktok.com/@${h}`;
    case "youtube":
      return `https://youtube.com/@${h}`;
  }
}

export function isSafeExternalUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function platformDomain(platform: SocialPlatform): string {
  switch (platform) {
    case "instagram":
      return "instagram.com";
    case "tiktok":
      return "tiktok.com";
    case "youtube":
      return "youtube.com";
  }
}
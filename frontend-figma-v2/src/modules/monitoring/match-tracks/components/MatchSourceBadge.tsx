import { Badge } from "@/components/ui/badge";
import { PlatformBadge, type PlatformId } from "@/components/ui/platform-badge";
import { matchTracksStrings } from "../strings";
import type { MatchSourcePlatform } from "../types";

const PLATFORM_ID: Record<MatchSourcePlatform, PlatformId> = {
  spotify: "instagram", // not used; spotify rendered as text chip
  tiktok: "tiktok",
  meta: "facebook",
};

interface SourceBadgeProps {
  source: MatchSourcePlatform | "catalog";
  size?: "xs" | "sm" | "md";
}

/**
 * Badge unificado para identificar el origen de un track.
 * Spotify y Catalog se renderizan como chips de texto (no son IG/TT/FB).
 * TikTok y Meta usan PlatformBadge del DS.
 */
export function MatchSourceBadge({ source, size = "sm" }: SourceBadgeProps) {
  if (source === "spotify") {
    return (
      <Badge variant="outline" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
        {matchTracksStrings.platforms.spotify}
      </Badge>
    );
  }
  if (source === "catalog") {
    return <Badge variant="default">{matchTracksStrings.platforms.catalog}</Badge>;
  }
  const label = matchTracksStrings.platforms[source];
  return (
    <span className="inline-flex items-center gap-1.5">
      <PlatformBadge platform={PLATFORM_ID[source]} size={size} />
      <span className="text-xs text-foreground">{label}</span>
    </span>
  );
}

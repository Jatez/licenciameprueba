import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge, type PlatformId } from "@/components/ui/platform-badge";
import { TopItemRow } from "@/shared/components/ds/TopItemRow";
import type { TopSongSort, TopTrack } from "@/api/types.dashboard";
import { dashboardV2Strings, fmt, plural } from "../../strings";
import { useFormatCompactNumber } from "../../hooks";

interface TopTrackRowProps {
  track: TopTrack;
  position: number;
  sort: TopSongSort;
}

/**
 * Domain adapter over the DS primitive `<TopItemRow />`.
 * Maps a TopTrack + sort mode to the generic row shape.
 */
export function TopTrackRow({ track, position, sort }: TopTrackRowProps) {
  const navigate = useNavigate();
  const t = dashboardV2Strings.topTracks;
  const formatCompact = useFormatCompactNumber();

  const licensesText = plural(
    { one: t.licenseSingular, other: t.licensePlural },
    track.licensesCount,
  );
  const impressionsText = fmt(t.impressionsLabel, { count: formatCompact(track.totalImpressions) });
  const creditsText = fmt(t.creditsLabel, { count: track.creditsConsumed });

  const primaryByMode: Record<TopSongSort, string> = {
    licenses: licensesText,
    impressions: impressionsText,
    credits: creditsText,
  };

  const secondaryByMode: Record<TopSongSort, string> = {
    licenses: `${impressionsText} · ${creditsText}`,
    impressions: `${licensesText} · ${creditsText}`,
    credits: `${licensesText} · ${impressionsText}`,
  };

  const ariaLabel = fmt(t.rowAriaLabel, {
    position,
    title: track.title,
    artist: track.artist,
    metric: primaryByMode[sort],
  });

  return (
    <TopItemRow
      position={position}
      cover={{ src: track.coverUrl, alt: "", fallbackIcon: Music }}
      title={track.title}
      subtitle={track.artist}
      rightBadges={track.platforms.map((p) => (
        <PlatformBadge key={p} platform={p as PlatformId} size="sm" />
      ))}
      primaryMetric={
        <Badge variant="metric" className="px-2.5 py-1 text-[11px] font-semibold font-tnum">
          {primaryByMode[sort]}
        </Badge>
      }
      secondaryMetric={secondaryByMode[sort]}
      onClick={() => navigate(`/catalog/track/${track.id}`)}
      ariaLabel={ariaLabel}
    />
  );
}

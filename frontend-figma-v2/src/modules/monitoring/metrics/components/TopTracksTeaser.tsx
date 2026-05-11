/**
 * F-11 · Top tracks teaser. Shows up to 3 entries; the full ranking ships in Prompt 3.
 */
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber } from "@/shared/format";
import type { MetricsTopTrack } from "../types";
import { metricsStrings } from "../strings";

interface TopTracksTeaserProps {
  tracks: MetricsTopTrack[] | null;
  isLoading: boolean;
  onSeeAll: () => void;
}

export function TopTracksTeaser({ tracks, isLoading, onSeeAll }: TopTracksTeaserProps) {
  if (!isLoading && (!tracks || tracks.length === 0)) return null;

  const podium = tracks?.slice(0, 3) ?? [];

  return (
    <Card id="top-tracks" className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          {metricsStrings.topTracksTeaser.title}
        </h3>
        <button
          type="button"
          onClick={onSeeAll}
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 hover:text-foreground"
        >
          {metricsStrings.topTracksTeaser.cta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          : podium.map((t) => (
              <li
                key={t.trackId}
                className="flex items-center gap-3 rounded-lg border border-foreground/5 p-3"
              >
                <div className="relative">
                  <img
                    src={t.trackCoverUrl}
                    alt=""
                    loading="lazy"
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <span
                    className="absolute -left-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary font-tnum text-[11px] font-semibold text-foreground"
                    aria-label={`Posición ${t.rank}`}
                  >
                    {t.rank}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{t.trackTitle}</p>
                  <p className="truncate text-xs text-foreground/60">{t.trackArtist}</p>
                  <p className="mt-1 font-tnum text-xs text-foreground/70">
                    {formatCompactNumber(t.totalViews)} reproducciones
                  </p>
                </div>
              </li>
            ))}
      </ul>
    </Card>
  );
}

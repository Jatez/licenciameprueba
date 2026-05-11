import { memo, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrackPreviewButton } from "@/shared/components/ds/TrackPreviewButton";
import type { TrackSummary } from "@/api/types";
import { catalogStrings } from "@/modules/tracks/strings";
import { formatDuration, interpolate } from "@/modules/tracks/utils";
import { usePlayer } from "@/modules/packages/player/hooks/usePlayer";
import { PlatformIcons } from "../PlatformIcons";
import { TrackCardFavorite } from "../TrackCard/TrackCardFavorite";

interface TrackRowProps {
  track: TrackSummary;
}

function TrackRowImpl({ track }: TrackRowProps) {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, loadAndPlay, togglePlay } = usePlayer();

  const isActive = currentTrack?.id === track.id;
  const isThisPlaying = isActive && isPlaying;

  const handlePlay = (e: MouseEvent) => {
    e.stopPropagation();
    if (isActive) togglePlay();
    else void loadAndPlay(track);
  };

  const handleBody = () => navigate(`/catalog/track/${track.id}`);

  const handleLicense = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/licensing/new?trackId=${track.id}`);
  };

  const titleId = `track-row-title-${track.id}`;
  const genreLabel =
    catalogStrings.genres[track.genre as keyof typeof catalogStrings.genres] ?? track.genre;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "group flex items-center gap-3 rounded-card border border-border bg-surface px-3 py-2 transition-shadow hover:shadow-sm",
        isActive && "ring-2 ring-primary",
      )}
    >
      {/* Cover + play */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={interpolate(catalogStrings.trackCard.coverAlt, {
              title: track.title,
              artist: track.artist,
            })}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        <TrackPreviewButton
          isPlaying={isThisPlaying}
          onClick={handlePlay}
          variant="overlay"
          size="sm"
          forceVisible={isActive}
          overlayOpacity={0.45}
          playLabel={catalogStrings.trackCard.playPreview}
          pauseLabel={catalogStrings.trackCard.pausePreview}
        />
      </div>

      {/* Body */}
      <button
        type="button"
        onClick={handleBody}
        className="flex min-w-0 flex-1 flex-col items-start text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={interpolate(catalogStrings.trackCard.viewDetails, { title: track.title })}
      >
        <h3 id={titleId} className="line-clamp-1 text-sm font-semibold text-foreground">
          {track.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{track.artist}</p>
      </button>

      {/* Meta */}
      <div className="hidden text-xs text-muted-foreground sm:block">{genreLabel}</div>
      <div className="hidden text-xs text-muted-foreground sm:block">
        {formatDuration(track.durationSec)}
      </div>

      <PlatformIcons licensable={track.platformsLicensable} />

      <div className="flex items-center gap-1">
        <TrackCardFavorite trackId={track.id} isFavorite={track.isFavorite} />
        <Button size="sm" onClick={handleLicense}>
          {catalogStrings.trackCard.licenseCta}
        </Button>
      </div>
    </article>
  );
}

export const TrackRow = memo(TrackRowImpl);

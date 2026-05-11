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
import { TrackCardFavorite } from "./TrackCardFavorite";

interface TrackCardProps {
  track: TrackSummary;
}

function TrackCardImpl({ track }: TrackCardProps) {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, loadAndPlay, togglePlay } = usePlayer();

  const isActive = currentTrack?.id === track.id;
  const isThisPlaying = isActive && isPlaying;

  const handlePlayClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (isActive) togglePlay();
    else void loadAndPlay(track);
  };

  const handleBodyClick = () => navigate(`/catalog/track/${track.id}`);

  const handleLicense = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/licensing/new?trackId=${track.id}`);
  };

  const titleId = `track-card-title-${track.id}`;
  const genreLabel =
    catalogStrings.genres[track.genre as keyof typeof catalogStrings.genres] ?? track.genre;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-shadow hover:shadow-md",
        isActive && "ring-2 ring-primary",
      )}
    >
      {/* Media */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={interpolate(catalogStrings.trackCard.coverAlt, {
              title: track.title,
              artist: track.artist,
            })}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-muted"
            aria-label={catalogStrings.trackCard.coverPlaceholder}
          >
            <Music className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        <TrackPreviewButton
          isPlaying={isThisPlaying}
          onClick={handlePlayClick}
          variant="overlay"
          size="md"
          forceVisible={isActive}
          overlayOpacity={0.35}
          playLabel={catalogStrings.trackCard.playPreview}
          pauseLabel={catalogStrings.trackCard.pausePreview}
        />
      </div>

      {/* Body */}
      <button
        type="button"
        onClick={handleBodyClick}
        className="flex flex-col items-start gap-0.5 px-3 pt-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={interpolate(catalogStrings.trackCard.viewDetails, { title: track.title })}
      >
        <h3 id={titleId} className="line-clamp-1 text-sm font-semibold text-foreground">
          {track.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{track.artist}</p>
        <p className="text-xs text-muted-foreground/80">
          {genreLabel} · {formatDuration(track.durationSec)}
        </p>
      </button>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-2">
        <PlatformIcons licensable={track.platformsLicensable} />
        <div className="flex items-center gap-1">
          <TrackCardFavorite trackId={track.id} isFavorite={track.isFavorite} />
          <Button size="sm" onClick={handleLicense}>
            {catalogStrings.trackCard.licenseCta}
          </Button>
        </div>
      </div>
    </article>
  );
}

export const TrackCard = memo(TrackCardImpl);

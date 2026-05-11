import { memo, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPreviewButton } from "@/shared/components/ds/TrackPreviewButton";
import { usePlayer } from "@/modules/packages/player/hooks/usePlayer";
import { catalogStrings } from "@/modules/tracks/strings";
import { interpolate } from "@/modules/tracks/utils";
import type { TrackSummary } from "@/api/types";

interface SimilarTrackCardProps {
  track: TrackSummary;
}

function SimilarTrackCardImpl({ track }: SimilarTrackCardProps) {
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

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md transition-shadow hover:shadow-md",
        isActive && "ring-2 ring-primary",
      )}
    >
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
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        <TrackPreviewButton
          isPlaying={isThisPlaying}
          onClick={handlePlay}
          variant="overlay"
          size="sm"
          forceVisible={isActive}
          overlayOpacity={0.35}
          playLabel={catalogStrings.trackCard.playPreview}
          pauseLabel={catalogStrings.trackCard.pausePreview}
        />
      </div>
      <button
        type="button"
        onClick={handleBody}
        className="flex flex-col items-start gap-0.5 px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={interpolate(catalogStrings.trackCard.viewDetails, { title: track.title })}
      >
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{track.title}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{track.artist}</p>
      </button>
    </article>
  );
}

export const SimilarTrackCard = memo(SimilarTrackCardImpl);

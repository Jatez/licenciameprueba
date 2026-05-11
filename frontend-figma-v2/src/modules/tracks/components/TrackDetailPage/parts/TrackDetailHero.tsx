import { ArrowRight, Heart, Music } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { TrackPreviewButton } from "@/shared/components/ds/TrackPreviewButton";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/modules/packages/player/hooks/usePlayer";
import { useToggleFavorite } from "@/modules/tracks/hooks/useToggleFavorite";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import { catalogStrings } from "@/modules/tracks/strings";
import { formatDuration, interpolate } from "@/modules/tracks/utils";
import { PlatformIcons } from "../../PlatformIcons";
import { platformsLicensableFor } from "@/api/mocks/tracks.mocks";
import type { Track, TrackSummary } from "@/api/types";

interface TrackDetailHeroProps {
  track: Track;
}

function toSummary(track: Track): TrackSummary {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    coverUrl: track.coverUrl,
    genre: track.genre,
    moods: track.moods,
    durationSec: track.durationSec,
    previewUrl: track.previewUrl,
    waveformPeaks: track.waveformPeaks,
    popularityScore: track.popularityScore,
    platformsLicensable: platformsLicensableFor(track),
    isFavorite: track.isFavorite,
  };
}

export function TrackDetailHero({ track }: TrackDetailHeroProps) {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, loadAndPlay, togglePlay } = usePlayer();
  const favoritesEnabled = useFeatureFlag("FEATURE_FAVORITES");
  const toggleFav = useToggleFavorite();

  const isActive = currentTrack?.id === track.id;
  const isThisPlaying = isActive && isPlaying;

  const genreLabel =
    catalogStrings.genres[track.genre as keyof typeof catalogStrings.genres] ?? track.genre;
  const inlineMeta = [
    genreLabel,
    formatDuration(track.durationSec),
    track.releaseYear ?? null,
    track.bpm !== null ? `${track.bpm} BPM` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const handlePlay = async () => {
    if (isActive) togglePlay();
    else await loadAndPlay(toSummary(track));
  };

  const handleLicense = () => navigate(`/licensing/new?trackId=${track.id}`);

  const platformsLicensable = platformsLicensableFor(track);

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
      {/* Cover */}
      <div className="mx-auto w-full max-w-[240px] lg:mx-0 lg:max-w-none">
        <AspectRatio ratio={1} className="overflow-hidden rounded-card bg-muted">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={interpolate(catalogStrings.trackCard.coverAlt, {
                title: track.title,
                artist: track.artist,
              })}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              aria-label={catalogStrings.trackCard.coverPlaceholder}
            >
              <Music className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{track.title}</h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {track.artist}
            {track.album ? <span> · {track.album}</span> : null}
          </p>
          {inlineMeta ? (
            <p className="mt-1 text-sm text-muted-foreground/80">{inlineMeta}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PlatformIcons licensable={platformsLicensable} size="md" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TrackPreviewButton
            isPlaying={isThisPlaying}
            onClick={handlePlay}
            variant="standalone"
            playLabel={catalogStrings.trackDetail.playPreview}
            pauseLabel={catalogStrings.trackDetail.pausePreview}
            standaloneLabel={
              isThisPlaying
                ? catalogStrings.trackDetail.pausePreview
                : catalogStrings.trackDetail.playPreview
            }
          />

          {favoritesEnabled ? (
            <Button
              variant="ghost"
              onClick={() => toggleFav.mutate(track.id)}
              aria-pressed={track.isFavorite}
              aria-label={
                track.isFavorite
                  ? catalogStrings.trackDetail.favoriteRemove
                  : catalogStrings.trackDetail.favoriteAdd
              }
              className="gap-2"
            >
              <Heart
                className={cn("h-4 w-4", track.isFavorite && "fill-error text-error")}
                aria-hidden="true"
              />
              {track.isFavorite
                ? catalogStrings.trackDetail.favoriteRemove
                : catalogStrings.trackDetail.favoriteAdd}
            </Button>
          ) : null}
        </div>

        <div>
          <Button size="lg" onClick={handleLicense} className="gap-2">
            {catalogStrings.trackDetail.licenseNow}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}

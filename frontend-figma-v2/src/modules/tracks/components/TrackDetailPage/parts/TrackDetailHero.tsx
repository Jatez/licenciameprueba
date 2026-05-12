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
  const heroBackground = track.coverUrl
    ? `linear-gradient(120deg, rgba(10, 10, 12, 0.72) 0%, rgba(10, 10, 12, 0.38) 46%, rgba(10, 10, 12, 0.82) 100%), url(${track.coverUrl})`
    : "linear-gradient(135deg, rgba(19, 24, 35, 0.96) 0%, rgba(55, 65, 81, 0.92) 48%, rgba(17, 24, 39, 0.98) 100%)";

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-black/5 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: heroBackground }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(233,255,82,0.24),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      <div className="relative grid gap-4 p-4 sm:p-5 lg:grid-cols-[136px_minmax(0,1fr)_208px] lg:items-center lg:gap-6 lg:p-6">
        <div className="mx-auto w-full max-w-[148px] lg:mx-0">
          <AspectRatio
            ratio={1}
            className="overflow-hidden rounded-[22px] border border-white/20 bg-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm"
          >
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
                className="flex h-full w-full items-center justify-center bg-white/10"
                aria-label={catalogStrings.trackCard.coverPlaceholder}
              >
                <Music className="h-16 w-16 text-white/70" aria-hidden="true" />
              </div>
            )}
          </AspectRatio>
        </div>

        <div className="min-w-0 space-y-3 text-white">
          <div className="space-y-1.5">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white/78 uppercase backdrop-blur-sm">
              Track detail
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.35rem] lg:leading-[1.02]">
                {track.title}
              </h1>
              <p className="mt-1.5 text-base text-white/84 sm:text-[1.05rem]">
                {track.artist}
                {track.album ? <span className="text-white/60"> · {track.album}</span> : null}
              </p>
            </div>
            {inlineMeta ? (
              <p className="text-[13px] text-white/68">{inlineMeta}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-white/12 bg-black/12 px-3.5 py-2.5 backdrop-blur-md">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
              Disponible en
            </span>
            <PlatformIcons licensable={platformsLicensable} size="md" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 lg:min-w-[208px] lg:items-stretch">
          <Button
            id="track-detail-license-cta"
            size="default"
            onClick={handleLicense}
            className="h-11 gap-2 rounded-full border border-[#e9ff52]/40 bg-[#e9ff52] px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_24px_rgba(233,255,82,0.28)] hover:bg-[#f0ff7a]"
          >
            {catalogStrings.trackDetail.licenseNow}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>

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
              className="h-10 justify-start gap-2 rounded-full border border-white/12 bg-white/8 px-4 text-white hover:bg-white/14"
            >
              <Heart
                className={cn("h-4 w-4", track.isFavorite && "fill-[#e9ff52] text-[#e9ff52]")}
                aria-hidden="true"
              />
              {track.isFavorite
                ? catalogStrings.trackDetail.favoriteRemove
                : catalogStrings.trackDetail.favoriteAdd}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

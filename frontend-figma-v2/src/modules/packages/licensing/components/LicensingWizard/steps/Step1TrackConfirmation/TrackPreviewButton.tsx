import { TrackPreviewButton as DSTrackPreviewButton } from "@/shared/components/ds/TrackPreviewButton";
import { usePlayer } from "@/modules/packages/player";
import type { Track, TrackSummary } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";

interface Props {
  track: Track;
}

function toSummary(t: Track): TrackSummary {
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    coverUrl: t.coverUrl,
    genre: t.genre,
    moods: t.moods,
    durationSec: t.durationSec,
    previewUrl: t.previewUrl,
    waveformPeaks: t.waveformPeaks,
    popularityScore: t.popularityScore,
    platformsLicensable: t.platformLicensability
      .filter((p) => p.allowed)
      .map((p) => p.platform),
    isFavorite: t.isFavorite,
  };
}

/**
 * Plays the preview through the global PersistentPlayer. Never spawns its own
 * <audio> element — single source of audio truth lives in `audioEngine`.
 *
 * Thin adapter over the DS primitive `<TrackPreviewButton variant="standalone" />`.
 * The wrapper stays so existing wizard imports keep working unchanged.
 */
export function TrackPreviewButton({ track }: Props) {
  const { currentTrack, isPlaying, loadAndPlay, togglePlay } = usePlayer();
  const isThisPlaying = currentTrack?.id === track.id && isPlaying;

  const handleClick = async () => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      await loadAndPlay(toSummary(track));
    }
  };

  return (
    <DSTrackPreviewButton
      isPlaying={isThisPlaying}
      onClick={handleClick}
      variant="standalone"
      playLabel={licensingStrings.step1.preview}
      pauseLabel={licensingStrings.step1.pause}
      standaloneLabel={
        isThisPlaying ? licensingStrings.step1.pause : licensingStrings.step1.preview
      }
    />
  );
}

import { TrackPreviewButton } from "@/shared/components/ds/TrackPreviewButton";
import { usePlayer } from "@/modules/packages/player/hooks/usePlayer";
import { catalogStrings } from "@/modules/tracks/strings";
import { PREVIEW_DURATION_SEC } from "@/shared/audio";
import type { TrackSummary } from "@/api/types";

interface TrackDetailFallbackPlayerProps {
  track: TrackSummary;
}

/** Linear progress bar + play button when the waveform isn't available. */
export function TrackDetailFallbackPlayer({ track }: TrackDetailFallbackPlayerProps) {
  const { currentTrack, currentTimeSec, isPlaying, loadAndPlay, togglePlay } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const isThisPlaying = isActive && isPlaying;
  const position = isActive ? currentTimeSec : 0;
  const progressPct = Math.min(100, (position / PREVIEW_DURATION_SEC) * 100);
  const s = catalogStrings.trackDetail.waveform;

  const handleClick = async () => {
    if (isActive) togglePlay();
    else await loadAndPlay(track);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 rounded-md border border-border bg-surface p-4">
        <TrackPreviewButton
          isPlaying={isThisPlaying}
          onClick={handleClick}
          variant="standalone"
          playLabel={catalogStrings.trackDetail.playPreview}
          pauseLabel={catalogStrings.trackDetail.pausePreview}
        />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-100"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{s.positionStart}</span>
        <span>{s.previewLimited}</span>
        <span>{s.positionEnd}</span>
      </div>
    </div>
  );
}

import { useId } from "react";
import { PREVIEW_DURATION_SEC } from "@/shared/audio";
import { usePlayer } from "@/modules/packages/player/hooks/usePlayer";
import { catalogStrings } from "@/modules/tracks/strings";
import type { TrackSummary } from "@/api/types";

interface TrackDetailWaveformProps {
  peaks: number[];
  track: TrackSummary;
}

const BAR_COUNT = 200;
const VIEWBOX_HEIGHT = 40;

/** Large seekable waveform, only animated when the global player holds this track. */
export function TrackDetailWaveform({ peaks, track }: TrackDetailWaveformProps) {
  const sliderId = useId();
  const { currentTrack, currentTimeSec, loadAndPlay, seek } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const position = isActive ? currentTimeSec : 0;
  const progress = Math.min(1, position / PREVIEW_DURATION_SEC);
  const playedBars = Math.floor(progress * BAR_COUNT);

  const normalisedPeaks: number[] = new Array(BAR_COUNT);
  for (let i = 0; i < BAR_COUNT; i++) {
    const srcIndex = Math.floor((i / BAR_COUNT) * peaks.length);
    normalisedPeaks[i] = peaks[srcIndex] ?? 0;
  }

  const handlePointer = async (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const target = ratio * PREVIEW_DURATION_SEC;
    if (!isActive) {
      await loadAndPlay(track);
    }
    seek(target);
  };

  const handleKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isActive) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      seek(currentTimeSec - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      seek(currentTimeSec + 1);
    }
  };

  const s = catalogStrings.trackDetail.waveform;

  return (
    <div className="space-y-2">
      <button
        id={sliderId}
        type="button"
        onPointerDown={handlePointer}
        onKeyDown={handleKey}
        className="group relative h-24 w-full cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-32"
        role="slider"
        aria-label={s.ariaLabel}
        aria-valuemin={0}
        aria-valuemax={PREVIEW_DURATION_SEC}
        aria-valuenow={Math.round(position)}
      >
        <svg
          viewBox={`0 0 ${BAR_COUNT} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          {normalisedPeaks.map((peak, index) => {
            const barHeight = Math.max(2, peak * VIEWBOX_HEIGHT);
            const y = (VIEWBOX_HEIGHT - barHeight) / 2;
            const isPlayed = index < playedBars;
            return (
              <rect
                key={index}
                x={index + 0.15}
                y={y}
                width={0.7}
                height={barHeight}
                rx={0.3}
                className={isPlayed ? "fill-primary" : "fill-lm-gray-300"}
              />
            );
          })}
        </svg>
      </button>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{s.positionStart}</span>
        <span>{s.previewLimited}</span>
        <span>{s.positionEnd}</span>
      </div>
    </div>
  );
}

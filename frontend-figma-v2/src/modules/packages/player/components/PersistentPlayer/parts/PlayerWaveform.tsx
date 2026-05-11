import { useId } from "react";
import { usePlayer } from "../../../hooks/usePlayer";
import { PREVIEW_DURATION_SEC } from "@/shared/audio";
import { formatTime } from "../../../utils/formatTime";
import { playerStrings } from "../../../strings";

interface PlayerWaveformProps {
  peaks: number[];
  currentTimeSec: number;
}

const BAR_COUNT = 200;
const VIEWBOX_HEIGHT = 40;

/**
 * Click-to-seek waveform rendered as inline SVG.
 * Bars before the current position are filled with the primary token,
 * the rest with neutral gray-300.
 */
export function PlayerWaveform({ peaks, currentTimeSec }: PlayerWaveformProps) {
  const { seek } = usePlayer();
  const sliderId = useId();
  const progress = Math.min(1, currentTimeSec / PREVIEW_DURATION_SEC);
  const playedBars = Math.floor(progress * BAR_COUNT);

  // Down-sample / up-sample peaks to BAR_COUNT.
  const normalisedPeaks: number[] = new Array(BAR_COUNT);
  for (let i = 0; i < BAR_COUNT; i++) {
    const srcIndex = Math.floor((i / BAR_COUNT) * peaks.length);
    normalisedPeaks[i] = peaks[srcIndex] ?? 0;
  }

  const handlePointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    seek(ratio * PREVIEW_DURATION_SEC);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      seek(currentTimeSec - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      seek(currentTimeSec + 1);
    }
  };

  return (
    <button
      id={sliderId}
      type="button"
      onPointerDown={handlePointer}
      onKeyDown={handleKeyDown}
      className="group relative w-full h-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      role="slider"
      aria-label={playerStrings.progress}
      aria-valuemin={0}
      aria-valuemax={PREVIEW_DURATION_SEC}
      aria-valuenow={Math.round(currentTimeSec)}
      aria-valuetext={`${formatTime(currentTimeSec)} de ${formatTime(PREVIEW_DURATION_SEC)}`}
    >
      <svg
        viewBox={`0 0 ${BAR_COUNT} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        className="w-full h-full"
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
  );
}

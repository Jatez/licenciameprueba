import { Slider } from "@/components/ui/slider";
import { usePlayer } from "../../../hooks/usePlayer";
import { PREVIEW_DURATION_SEC } from "@/shared/audio";
import { formatTime } from "../../../utils/formatTime";
import { playerStrings } from "../../../strings";

interface PlayerLinearProgressProps {
  currentTimeSec: number;
}

/** Lightweight fallback when waveform peaks are unavailable or the flag is off. */
export function PlayerLinearProgress({ currentTimeSec }: PlayerLinearProgressProps) {
  const { seek } = usePlayer();
  const value = Math.min(currentTimeSec, PREVIEW_DURATION_SEC);

  return (
    <div className="w-full">
      <Slider
        value={[value]}
        min={0}
        max={PREVIEW_DURATION_SEC}
        step={0.1}
        onValueChange={(v) => seek(v[0] ?? 0)}
        aria-label={playerStrings.progress}
        aria-valuetext={`${formatTime(value)} de ${formatTime(PREVIEW_DURATION_SEC)}`}
      />
    </div>
  );
}

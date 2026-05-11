import { useIsMobile } from "@/hooks/use-mobile";
import { useFeatureFlag } from "@/shared/hooks";
import type { TrackSummary } from "@/api/types";
import { PlayerWaveform } from "./PlayerWaveform";
import { PlayerLinearProgress } from "./PlayerLinearProgress";
import { formatTime } from "../../../utils/formatTime";

interface PlayerProgressProps {
  track: TrackSummary;
  currentTimeSec: number;
}

export function PlayerProgress({ track, currentTimeSec }: PlayerProgressProps) {
  const isMobile = useIsMobile();
  const waveformEnabled = useFeatureFlag("FEATURE_WAVEFORM");
  const showWaveform = waveformEnabled && !isMobile && track.waveformPeaks !== null;

  return (
    <div className="flex w-full items-center gap-3">
      {isMobile && (
        <span className="tabular-nums text-[11px] text-lm-gray-500 w-8 text-right">
          {formatTime(currentTimeSec)}
        </span>
      )}
      <div className="flex-1">
        {showWaveform && track.waveformPeaks ? (
          <PlayerWaveform peaks={track.waveformPeaks} currentTimeSec={currentTimeSec} />
        ) : (
          <PlayerLinearProgress currentTimeSec={currentTimeSec} />
        )}
      </div>
      {isMobile && (
        <span className="tabular-nums text-[11px] text-lm-gray-500 w-8">0:30</span>
      )}
    </div>
  );
}

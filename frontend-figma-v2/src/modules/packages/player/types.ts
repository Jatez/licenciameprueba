import type { TrackSummary } from "@/api/types";

export interface PlayerPublicState {
  currentTrack: TrackSummary | null;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

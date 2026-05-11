import { usePlayerStore } from "@/stores/playerStore";
import { PREVIEW_DURATION_SEC } from "@/shared/audio";
import type { PlayerPublicState } from "../types";

/** Read-only snapshot of player state. Use `usePlayer` for actions. */
export function usePlayerState(): PlayerPublicState {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTimeSec = usePlayerStore((s) => s.currentTimeSec);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const error = usePlayerStore((s) => s.error);

  return {
    currentTrack,
    isPlaying,
    currentTimeSec,
    durationSec: PREVIEW_DURATION_SEC,
    volume,
    isMuted,
    error,
  };
}

import { useEffect, useRef } from "react";
import { audioEngine } from "@/shared/audio";
import { usePlayerStore } from "@/stores/playerStore";

const TIMEUPDATE_THROTTLE_MS = 200;

/**
 * Wires the singleton `audioEngine` events into the Zustand `playerStore`.
 *
 * MUST be mounted exactly ONCE at the app root (e.g. inside `AppLayout`).
 * Mounting it elsewhere will cause duplicate subscriptions and double-fired
 * store updates.
 */
export function useSyncPlayerWithEngine(): void {
  const lastTimeUpdateRef = useRef<number>(0);

  useEffect(() => {
    const setCurrentTime = usePlayerStore.getState().setCurrentTime;
    const pause = usePlayerStore.getState().pause;
    const play = usePlayerStore.getState().play;
    const setError = usePlayerStore.getState().setError;

    const offTime = audioEngine.on("timeupdate", (payload) => {
      const now = Date.now();
      if (now - lastTimeUpdateRef.current < TIMEUPDATE_THROTTLE_MS) return;
      lastTimeUpdateRef.current = now;
      setCurrentTime(payload.currentTimeSec);
    });
    const offEnded = audioEngine.on("ended", () => {
      pause();
      setCurrentTime(0);
    });
    const offError = audioEngine.on("error", (payload) => {
      pause();
      setError(payload.errorMessage ?? "Audio error");
    });
    const offPlay = audioEngine.on("play", () => play());
    const offPause = audioEngine.on("pause", () => pause());

    return () => {
      offTime();
      offEnded();
      offError();
      offPlay();
      offPause();
    };
  }, []);

  // Sync volume/mute from persisted store → engine on mount.
  useEffect(() => {
    const { volume, isMuted } = usePlayerStore.getState();
    audioEngine.setVolume(volume);
    audioEngine.setMuted(isMuted);
  }, []);
}

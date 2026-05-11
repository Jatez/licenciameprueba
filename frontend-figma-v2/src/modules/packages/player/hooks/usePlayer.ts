import { useCallback } from "react";
import type { TrackSummary } from "@/api/types";
import { audioEngine, PREVIEW_DURATION_SEC } from "@/shared/audio";
import { usePlayerStore } from "@/stores/playerStore";

/**
 * Public player hook — reads from the Zustand store and exposes actions that
 * orchestrate the singleton `audioEngine` together with store mutations.
 *
 * Side-effects (engine ↔ store sync) live in `useSyncPlayerWithEngine`,
 * which must be mounted exactly once at the app root.
 */
export function usePlayer() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTimeSec = usePlayerStore((s) => s.currentTimeSec);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const error = usePlayerStore((s) => s.error);

  const storeLoadTrack = usePlayerStore((s) => s.loadTrack);
  const storePlay = usePlayerStore((s) => s.play);
  const storePause = usePlayerStore((s) => s.pause);
  const storeSetCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const storeSetVolume = usePlayerStore((s) => s.setVolume);
  const storeToggleMute = usePlayerStore((s) => s.toggleMute);
  const storeSetError = usePlayerStore((s) => s.setError);
  const storeReset = usePlayerStore((s) => s.reset);

  const loadAndPlay = useCallback(
    async (track: TrackSummary): Promise<void> => {
      const isSame = currentTrack?.id === track.id;
      if (!isSame) {
        audioEngine.stop();
        audioEngine.load(track.previewUrl, { maxDurationSec: PREVIEW_DURATION_SEC });
        storeLoadTrack(track);
      }
      audioEngine.setVolume(volume);
      audioEngine.setMuted(isMuted);
      try {
        await audioEngine.play();
        storePlay();
      } catch {
        // error event already emitted; store.error will be set by the sync hook
      }
    },
    [currentTrack?.id, isMuted, storeLoadTrack, storePlay, volume],
  );

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioEngine.pause();
      storePause();
    } else {
      audioEngine.play().then(storePlay).catch(() => {
        // error handled via engine event
      });
    }
  }, [currentTrack, isPlaying, storePause, storePlay]);

  const seek = useCallback(
    (sec: number) => {
      const clamped = Math.max(0, Math.min(sec, PREVIEW_DURATION_SEC));
      audioEngine.seek(clamped);
      storeSetCurrentTime(clamped);
    },
    [storeSetCurrentTime],
  );

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(v, 1));
      audioEngine.setVolume(clamped);
      storeSetVolume(clamped);
      if (clamped > 0 && isMuted) {
        audioEngine.setMuted(false);
        storeToggleMute();
      }
    },
    [isMuted, storeSetVolume, storeToggleMute],
  );

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    audioEngine.setMuted(next);
    storeToggleMute();
  }, [isMuted, storeToggleMute]);

  const close = useCallback(() => {
    audioEngine.stop();
    storeReset();
  }, [storeReset]);

  const retry = useCallback(() => {
    if (!currentTrack) return;
    storeSetError(null);
    audioEngine.load(currentTrack.previewUrl, { maxDurationSec: PREVIEW_DURATION_SEC });
    audioEngine.play().then(storePlay).catch(() => {
      // error event will set store.error again
    });
  }, [currentTrack, storePlay, storeSetError]);

  return {
    currentTrack,
    isPlaying,
    currentTimeSec,
    volume,
    isMuted,
    error,
    loadAndPlay,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    close,
    retry,
  };
}

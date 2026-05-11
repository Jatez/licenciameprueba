import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackSummary } from "@/api/types";

interface PlayerStore {
  currentTrack: TrackSummary | null;
  isPlaying: boolean;
  currentTimeSec: number;
  /** 0..1 — persisted across sessions. */
  volume: number;
  /** persisted across sessions. */
  isMuted: boolean;
  isExpanded: boolean;
  error: string | null;

  loadTrack: (track: TrackSummary) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setExpanded: (expanded: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * Global player UI state.
 * Audio playback is delegated to `src/shared/audio/audioEngine` — this store
 * just mirrors what the UI needs to render.
 */
export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      currentTrack: null,
      isPlaying: false,
      currentTimeSec: 0,
      volume: 0.8,
      isMuted: false,
      isExpanded: false,
      error: null,

      loadTrack: (track) =>
        set({ currentTrack: track, currentTimeSec: 0, error: null, isPlaying: false }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
      setCurrentTime: (time) => set({ currentTimeSec: time }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      setExpanded: (expanded) => set({ isExpanded: expanded }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          currentTrack: null,
          isPlaying: false,
          currentTimeSec: 0,
          isExpanded: false,
          error: null,
        }),
    }),
    {
      name: "licenciame-player-settings",
      partialize: (s) => ({ volume: s.volume, isMuted: s.isMuted }),
    },
  ),
);

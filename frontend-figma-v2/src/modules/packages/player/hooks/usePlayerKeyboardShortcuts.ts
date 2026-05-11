import { useEffect } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import { usePlayer } from "./usePlayer";

const SEEK_STEP_SEC = 5;
const VOLUME_STEP = 0.1;

function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return t.isContentEditable;
}

/**
 * Global keyboard shortcuts for the player.
 *  - Space → toggle play/pause
 *  - ← / → → seek ∓5s (clamped)
 *  - ↑ / ↓ → volume ±10%
 *  - M → toggle mute
 *
 * Ignored when the user is typing in an input, textarea, select or
 * contenteditable element. Inactive when no track is loaded.
 *
 * MUST be mounted exactly ONCE at the app root.
 */
export function usePlayerKeyboardShortcuts(): void {
  const player = usePlayer();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const hasTrack = usePlayerStore.getState().currentTrack !== null;
      if (!hasTrack) return;
      if (isTypingTarget(event.target)) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          player.togglePlay();
          break;
        case "ArrowRight": {
          event.preventDefault();
          const t = usePlayerStore.getState().currentTimeSec;
          player.seek(t + SEEK_STEP_SEC);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const t = usePlayerStore.getState().currentTimeSec;
          player.seek(t - SEEK_STEP_SEC);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const v = usePlayerStore.getState().volume;
          player.setVolume(v + VOLUME_STEP);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const v = usePlayerStore.getState().volume;
          player.setVolume(v - VOLUME_STEP);
          break;
        }
        case "KeyM":
          event.preventDefault();
          player.toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [player]);
}

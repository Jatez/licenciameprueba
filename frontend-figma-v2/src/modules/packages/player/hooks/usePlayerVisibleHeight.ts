import { useIsMobile } from "@/hooks/use-mobile";
import { usePlayerStore } from "@/stores/playerStore";

const DESKTOP_HEIGHT_PX = 96;
const MOBILE_HEIGHT_PX = 80;

/**
 * Returns the visible height of the persistent player (in CSS pixels) so the
 * scrollable body can reserve `padding-bottom` and avoid the player covering
 * the last row of content.
 */
export function usePlayerVisibleHeight(): number {
  const hasTrack = usePlayerStore((s) => s.currentTrack !== null);
  const isMobile = useIsMobile();
  if (!hasTrack) return 0;
  return isMobile ? MOBILE_HEIGHT_PX : DESKTOP_HEIGHT_PX;
}

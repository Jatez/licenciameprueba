import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { usePlayerState } from "../../hooks/usePlayerState";
import { usePlayerStore } from "@/stores/playerStore";
import { interpolate } from "../../utils/interpolate";
import { playerStrings } from "../../strings";
import { PlayerTrackInfo } from "./parts/PlayerTrackInfo";
import { PlayerControls } from "./parts/PlayerControls";
import { PlayerProgress } from "./parts/PlayerProgress";
import { PlayerVolumeControl } from "./parts/PlayerVolumeControl";
import { PlayerActions } from "./parts/PlayerActions";
import { PlayerErrorBanner } from "./parts/PlayerErrorBanner";
import { PlayerExpandedSheet } from "./parts/PlayerExpandedSheet";
import type { PersistentPlayerProps } from "./PersistentPlayer.types";

/**
 * Global, route-persistent audio player.
 *
 * Returns `null` when no track is loaded — this is the only place in the
 * codebase where such a render shortcut is allowed (documented exception).
 *
 * Z-index is `z-40`: above body content, below the mobile sidebar drawer (`z-50`).
 * Desktop: respects the sidebar gutter so it doesn't sit on top of the sidebar.
 * Mobile: full-bleed two-row layout, system-managed volume.
 */
export function PersistentPlayer({ className }: PersistentPlayerProps) {
  const state = usePlayerState();
  const isExpanded = usePlayerStore((s) => s.isExpanded);
  const isMobile = useIsMobile();
  const liveRegionRef = useRef<HTMLSpanElement>(null);

  // Announce play/pause/error transitions for screen readers.
  useEffect(() => {
    if (!liveRegionRef.current || !state.currentTrack) return;
    if (state.error) {
      liveRegionRef.current.textContent = playerStrings.shortcuts.announcement.error;
    } else if (state.isPlaying) {
      liveRegionRef.current.textContent = interpolate(
        playerStrings.shortcuts.announcement.playing,
        { title: state.currentTrack.title, artist: state.currentTrack.artist },
      );
    } else {
      liveRegionRef.current.textContent = playerStrings.shortcuts.announcement.paused;
    }
  }, [state.isPlaying, state.error, state.currentTrack]);

  if (!state.currentTrack) return null;

  const track = state.currentTrack;

  return (
    <TooltipProvider delayDuration={400}>
      <div
        role="region"
        aria-label={playerStrings.region}
        className={cn(
          "fixed z-40 bg-surface/95 backdrop-blur-xl border border-lm-gray-200 rounded-card shadow-lg",
          // Mobile placement (symmetric 10px on sides + bottom)
          "bottom-2.5 left-2.5 right-2.5",
          // Desktop placement: leaves room for the fixed sidebar; right + bottom gutters match (10px)
          "md:left-[calc(13.1875rem+0.625rem+0.625rem)] md:right-2.5 md:bottom-2.5",
          isExpanded && !isMobile ? "md:h-64" : "md:h-22",
          className,
        )}
        style={!isMobile ? { minHeight: isExpanded ? "16rem" : "5.5rem" } : undefined}
      >
        {state.error && <PlayerErrorBanner />}

        {/* Desktop layout */}
        {!isMobile && (
          <div className="h-full px-4 py-3 grid grid-cols-[minmax(220px,25%)_1fr_minmax(260px,28%)] items-center gap-4">
            <PlayerTrackInfo track={track} />
            <div className="flex flex-col gap-1.5 min-w-0">
              <PlayerControls
                isPlaying={state.isPlaying}
                currentTimeSec={state.currentTimeSec}
              />
              <PlayerProgress track={track} currentTimeSec={state.currentTimeSec} />
            </div>
            <div className="flex items-center justify-end gap-3">
              <PlayerVolumeControl volume={state.volume} isMuted={state.isMuted} />
              <PlayerActions track={track} isExpanded={isExpanded} />
            </div>
          </div>
        )}

        {/* Mobile layout: two rows */}
        {isMobile && (
          <div className="px-3 py-2 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <PlayerTrackInfo track={track} />
              </div>
              <PlayerControls
                isPlaying={state.isPlaying}
                currentTimeSec={state.currentTimeSec}
              />
              <PlayerActions track={track} isExpanded={isExpanded} />
            </div>
            <PlayerProgress track={track} currentTimeSec={state.currentTimeSec} />
          </div>
        )}

        {/* Expanded inline content (desktop) */}
        {isExpanded && !isMobile && (
          <div className="px-4 pb-3 border-t border-lm-gray-200 mt-2 pt-3 flex flex-wrap items-center gap-2 text-xs text-lm-gray-700">
            {track.moods.length > 0 && (
              <>
                <span className="font-semibold">{playerStrings.expanded.tags}:</span>
                {track.moods.slice(0, 6).map((m) => (
                  <Badge key={m} variant="outline">
                    {m}
                  </Badge>
                ))}
              </>
            )}
            <Badge variant="secondary" className="ml-auto">
              {playerStrings.expanded.genre}: {track.genre}
            </Badge>
          </div>
        )}

        <span ref={liveRegionRef} aria-live="polite" className="sr-only" />
      </div>

      {/* Mobile expanded sheet */}
      {isMobile && <PlayerExpandedSheet open={isExpanded} track={track} />}
    </TooltipProvider>
  );
}

import { forwardRef, type MouseEvent } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TrackPreviewButtonVariant = "overlay" | "standalone";
export type TrackPreviewButtonSize = "sm" | "md";

export interface TrackPreviewButtonProps {
  /** Whether the underlying track is currently playing. Drives icon + aria-pressed. */
  isPlaying: boolean;
  /** Click handler. Caller is responsible for play/pause toggling via usePlayer. */
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  /**
   * `overlay` (default) — absolute play overlay sitting on top of a cover image.
   * `standalone` — outline button rendered inline in toolbars / detail pages.
   */
  variant?: TrackPreviewButtonVariant;
  /** Size hint for the inner circle / button. */
  size?: TrackPreviewButtonSize;
  /** Force the overlay to stay visible (e.g. when the row is the active track). */
  forceVisible?: boolean;
  /**
   * Overlay scrim opacity. Two presets are kept to match existing callsites
   * (TrackCard / SimilarTrackCard use 0.35, TrackRow uses 0.45).
   * TODO(prompt-6): tokenize as `--overlay-scrim-low` / `--overlay-scrim-high`.
   */
  overlayOpacity?: 0.35 | 0.45;
  /** Standalone-only label shown next to the icon. */
  standaloneLabel?: string;
  /** aria-label used for both variants. */
  playLabel: string;
  pauseLabel: string;
  className?: string;
}

const overlayCircleSize: Record<TrackPreviewButtonSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
};

const overlayIconSize: Record<TrackPreviewButtonSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

/**
 * Unified preview play/pause control for tracks.
 *
 * Pure presentation — never imports `usePlayer`. Each callsite owns its
 * `usePlayer()` hook and passes `isPlaying` + `onClick`. Centralizes the
 * ink-900 scrim, primary circle, focus ring and aria-pressed contract used
 * across catalog cards, similar tracks, detail page and licensing wizard.
 */
export const TrackPreviewButton = forwardRef<HTMLButtonElement, TrackPreviewButtonProps>(
  function TrackPreviewButton(
    {
      isPlaying,
      onClick,
      variant = "overlay",
      size = "md",
      forceVisible = false,
      overlayOpacity = 0.35,
      standaloneLabel,
      playLabel,
      pauseLabel,
      className,
    },
    ref,
  ) {
    const ariaLabel = isPlaying ? pauseLabel : playLabel;

    if (variant === "standalone") {
      return (
        <Button
          ref={ref}
          type="button"
          variant="outline"
          size="sm"
          onClick={onClick}
          aria-pressed={isPlaying}
          aria-label={standaloneLabel ? undefined : ariaLabel}
          className={cn("gap-2", className)}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 translate-x-0.5" aria-hidden="true" />
          )}
          {standaloneLabel ?? ariaLabel}
        </Button>
      );
    }

    // overlay
    // TODO(prompt-6): tokenize the rgba scrim into a CSS variable.
    const scrim =
      overlayOpacity === 0.45
        ? "bg-[hsl(var(--ink-900)/0.45)]"
        : "bg-[hsl(var(--ink-900)/0.35)]";

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={isPlaying}
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          scrim,
          forceVisible
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          className,
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-primary text-ink-900 shadow-lg",
            overlayCircleSize[size],
          )}
        >
          {isPlaying ? (
            <Pause className={overlayIconSize[size]} aria-hidden="true" />
          ) : (
            <Play
              className={cn("translate-x-0.5", overlayIconSize[size])}
              aria-hidden="true"
            />
          )}
        </span>
      </button>
    );
  },
);

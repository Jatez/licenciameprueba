import { type KeyboardEvent, type ReactNode, type ElementType } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TopItemRowProps {
  /** Optional position numeral (1-based). Rendered with tabular numerals. */
  position?: number;
  /** Cover image config. If `src` is missing, fallback icon is used. */
  cover?: {
    src?: string;
    alt?: string;
    fallbackIcon?: LucideIcon;
  };
  /** Primary title (single line, truncated). */
  title: string;
  /** Secondary line, e.g. artist or category. */
  subtitle?: string;
  /** Right-aligned auxiliary chips (platform badges, tags). Hidden on small screens. */
  rightBadges?: ReactNode;
  /** Highlighted metric pill on the far right. */
  primaryMetric?: ReactNode;
  /** Smaller meta line under the primary metric. */
  secondaryMetric?: ReactNode;
  /** Click handler. Renders the row as a focusable interactive element. */
  onClick?: () => void;
  /** Custom aria-label for the row. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Generic horizontal "leaderboard" row: position · cover · title/subtitle ·
 * badges · metric. Used by TopTracks today; designed to host any ranked list
 * (top artists, top campaigns, top moods).
 *
 * Pure presentation — no domain knowledge. Accepts any cover image and any
 * fallback icon. Keep adapters thin (see TopTrackRow).
 */
export function TopItemRow({
  position,
  cover,
  title,
  subtitle,
  rightBadges,
  primaryMetric,
  secondaryMetric,
  onClick,
  ariaLabel,
  className,
}: TopItemRowProps) {
  const FallbackIcon: ElementType | undefined = cover?.fallbackIcon;
  const isInteractive = !!onClick;

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <li
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? "button" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors",
        isInteractive &&
          "cursor-pointer hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      {position != null && (
        <span className="w-6 shrink-0 text-base font-semibold text-foreground font-tnum tabular-nums">
          {position}
        </span>
      )}

      {cover && (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted-foreground/15">
          {cover.src ? (
            <img src={cover.src} alt={cover.alt ?? ""} className="h-full w-full object-cover" />
          ) : FallbackIcon ? (
            <FallbackIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          ) : null}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-foreground">{title}</span>
        {subtitle && (
          <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>

      {rightBadges && (
        <div className="hidden items-center gap-1 sm:flex">{rightBadges}</div>
      )}

      {(primaryMetric || secondaryMetric) && (
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          {primaryMetric}
          {secondaryMetric && (
            <span className="text-[11px] text-muted-foreground font-tnum">
              {secondaryMetric}
            </span>
          )}
        </div>
      )}
    </li>
  );
}

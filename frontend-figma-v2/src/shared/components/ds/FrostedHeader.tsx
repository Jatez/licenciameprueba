import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type FrostedHeaderIntensity = "subtle" | "default" | "strong";
export type FrostedHeaderPosition = "top" | "bottom";

export interface FrostedHeaderProps {
  children: ReactNode;
  /** Whether the header sticks to the edge of its scroll container. Defaults to true. */
  sticky?: boolean;
  /**
   * Visual intensity of the gradient + blur:
   * - "subtle"  → solid translucent surface (nav-style overlay).
   * - "default" → gradient that fades 100% → 0% over the header height (most app headers).
   * - "strong"  → heavier blur, gradient still fades but blur is more pronounced.
   */
  intensity?: FrostedHeaderIntensity;
  /**
   * Where the bar sticks within its scroll container:
   * - "top" (default): sticky-top header. Gradient is solid at the top and fades to transparent downward.
   * - "bottom": sticky-bottom footer. Gradient is solid at the bottom and fades to transparent upward.
   *   Use for wizard footers / persistent action bars where the buttons must stay visible.
   */
  position?: FrostedHeaderPosition;
  /**
   * Optional translateY offset (used for show/hide on scroll).
   * - For position="top" pass "-100%" to hide upward.
   * - For position="bottom" pass "100%" to hide downward.
   */
  translateY?: string;
  /** Override the base RGB triplet of the gradient (defaults to bodycard surface). */
  baseRgb?: string;
  className?: string;
  /** Inline style escape hatch (e.g. extra transforms). Merged after computed style. */
  style?: CSSProperties;
}

/**
 * Default base color matches `--bodycard-bg` (#F3F4F6).
 * TODO(prompt-6): swap to a CSS variable once page-bg / bodycard-bg are migrated to HSL.
 */
const DEFAULT_BASE_RGB = "243, 244, 246";

const BLUR_BY_INTENSITY: Record<FrostedHeaderIntensity, string> = {
  subtle: "blur(6px)",
  default: "blur(10px)",
  strong: "blur(16px)",
};

/** Top variant: solid at the top (0%), transparent at the bottom (100%). */
const GRADIENT_TOP: Record<FrostedHeaderIntensity, (rgb: string) => string> = {
  subtle: (rgb) => `rgba(${rgb}, 0.85)`,
  default: (rgb) =>
    `linear-gradient(180deg, rgba(${rgb}, 0.98) 0%, rgba(${rgb}, 0.46) 48%, rgba(${rgb}, 0.18) 82%, rgba(${rgb}, 0.08) 94%, rgba(${rgb}, 0) 100%)`,
  strong: (rgb) =>
    `linear-gradient(180deg, rgba(${rgb}, 1) 0%, rgba(${rgb}, 0.62) 56%, rgba(${rgb}, 0.24) 82%, rgba(${rgb}, 0.1) 94%, rgba(${rgb}, 0) 100%)`,
};

/** Bottom variant: transparent at the top (0%), solid at the bottom (100%). */
const GRADIENT_BOTTOM: Record<FrostedHeaderIntensity, (rgb: string) => string> = {
  subtle: (rgb) => `rgba(${rgb}, 0.85)`,
  default: (rgb) =>
    `linear-gradient(180deg, rgba(${rgb}, 0.98) 0%, rgba(${rgb}, 0.46) 48%, rgba(${rgb}, 0.18) 82%, rgba(${rgb}, 0.08) 94%, rgba(${rgb}, 0) 100%)`,
  strong: (rgb) =>
    `linear-gradient(180deg, rgba(${rgb}, 1) 0%, rgba(${rgb}, 0.62) 56%, rgba(${rgb}, 0.24) 82%, rgba(${rgb}, 0.1) 94%, rgba(${rgb}, 0) 100%)`,
};

const MASK_TOP =
  "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.92) 36%, rgba(0, 0, 0, 0.55) 62%, rgba(0, 0, 0, 0.24) 84%, rgba(0, 0, 0, 0.1) 94%, transparent 100%)";
const MASK_BOTTOM =
  "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.92) 36%, rgba(0, 0, 0, 0.55) 62%, rgba(0, 0, 0, 0.24) 84%, rgba(0, 0, 0, 0.1) 94%, transparent 100%)";

/**
 * Sticky bar with a translucent gradient + backdrop-blur — the standard
 * recipe for app-wide sticky headers AND wizard footers.
 *
 * - `position="top"`: sticky page headers inside a scroll container
 *   (Dashboard, Catalog, Licensing wizard header). Combine with `useHeadroom()`
 *   when you want hide/reveal-on-scroll behavior.
 * - `position="bottom"`: persistent action bars at the bottom of a scroll
 *   container (Licensing wizard footer with Anterior / Siguiente). Do NOT
 *   apply `useHeadroom()` here — primary actions must stay visible.
 *
 * Children are rendered as-is; layout/spacing of inner content is the caller's
 * responsibility (this component owns positioning + material only).
 */
export function FrostedHeader({
  children,
  sticky = true,
  intensity = "default",
  position = "top",
  translateY,
  baseRgb = DEFAULT_BASE_RGB,
  className,
  style,
}: FrostedHeaderProps) {
  const gradientMap = position === "bottom" ? GRADIENT_BOTTOM : GRADIENT_TOP;

  // Progressive backdrop blur: the mask fades the entire blurred surface so
  // the blur itself dissolves with the gradient (Apple-style), instead of a
  // hard rectangular cutoff.
  const maskImage = position === "bottom" ? MASK_BOTTOM : MASK_TOP;

  const computedStyle: CSSProperties = {
    ...(translateY !== undefined ? { transform: `translateY(${translateY})` } : null),
    ...style,
  };

  const materialStyle: CSSProperties = {
    background: gradientMap[intensity](baseRgb),
    backdropFilter: BLUR_BY_INTENSITY[intensity],
    WebkitBackdropFilter: BLUR_BY_INTENSITY[intensity],
    maskImage,
    WebkitMaskImage: maskImage,
  };

  const stickyClass =
    sticky && (position === "bottom" ? "sticky bottom-0 z-20" : "sticky top-0 z-20");

  return (
    <div
      className={cn(
        "relative isolate transition-transform duration-700 ease-out will-change-transform",
        stickyClass,
        className,
      )}
      style={computedStyle}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={materialStyle}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

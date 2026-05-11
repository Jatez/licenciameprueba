import { type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type ImageOverlayCardAspectRatio = "1/1" | "8/5" | "16/9" | "4/3";
export type ImageOverlayCardOverlayStyle = "gradient-bottom" | "gradient-full" | "blur-panel";
export type ImageOverlayCardOverlayIntensity = "subtle" | "default" | "strong";
export type ImageOverlayCardContentPosition = "bottom" | "center" | "top";
export type ImageOverlayCardHoverEffect = "scale" | "lift" | "none";

export interface ImageOverlayCardProps {
  image: string;
  title: string;
  description?: string;
  /** Aspect ratio of the card. Defaults to "8/5". */
  aspectRatio?: ImageOverlayCardAspectRatio;
  /**
   * - gradient-bottom: dark gradient anchored at the bottom (ThemedCard).
   * - gradient-full:   dark gradient covering the full surface (long copy).
   * - blur-panel:      bottom panel with white-blur material (CategoryCard / MoodCard).
   */
  overlayStyle?: ImageOverlayCardOverlayStyle;
  /** Strength of the overlay (only affects the gradient styles). */
  overlayIntensity?: ImageOverlayCardOverlayIntensity;
  /** Where the title/description block sits. */
  contentPosition?: ImageOverlayCardContentPosition;
  /** Optional CTA element (icon/button). Rendered next to the title. */
  cta?: ReactNode;
  /** Hover treatment. */
  hoverEffect?: ImageOverlayCardHoverEffect;
  /** Render container. Defaults to "button" (interactive). */
  as?: "button" | "a" | "div";
  onClick?: () => void;
  href?: string;
  /** Width override (e.g. for horizontal scrollers). */
  width?: number | string;
  className?: string;
  /** Custom alt text for the image. Defaults to "" since title carries the label. */
  imageAlt?: string;
  "aria-label"?: string;
}

/** Per-style/intensity gradient classes. Tokens only. */
const GRADIENT_BOTTOM: Record<ImageOverlayCardOverlayIntensity, string> = {
  subtle:
    "bg-gradient-to-t from-[hsl(var(--ink-900)/0.55)] via-[hsl(var(--ink-900)/0.15)] to-transparent",
  default:
    "bg-gradient-to-t from-[hsl(var(--ink-900)/0.85)] via-[hsl(var(--ink-900)/0.25)] to-transparent",
  strong:
    "bg-gradient-to-t from-[hsl(var(--ink-900)/0.95)] via-[hsl(var(--ink-900)/0.45)] to-transparent",
};

const GRADIENT_FULL: Record<ImageOverlayCardOverlayIntensity, string> = {
  subtle: "bg-[hsl(var(--ink-900)/0.25)]",
  default: "bg-[hsl(var(--ink-900)/0.45)]",
  strong: "bg-[hsl(var(--ink-900)/0.65)]",
};

const HOVER_IMAGE: Record<ImageOverlayCardHoverEffect, string> = {
  scale: "transition-transform duration-300 group-hover:scale-[1.04]",
  lift: "transition-transform duration-300",
  none: "",
};

const HOVER_WRAPPER: Record<ImageOverlayCardHoverEffect, string> = {
  scale: "",
  lift: "transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md",
  none: "",
};

const CONTENT_POSITION: Record<ImageOverlayCardContentPosition, string> = {
  bottom: "bottom-0 left-0 right-0",
  top: "top-0 left-0 right-0",
  center: "inset-0 flex flex-col items-center justify-center text-center",
};

/**
 * Universal image-card-with-overlay primitive used across the product.
 *
 * Three real-world variants derive from this primitive:
 * - ThemedCard       (catalog/ThemedCards) → gradient-bottom · 8/5 · scale
 * - CategoryCard     (components/cards)    → blur-panel · 1/1 · scale
 * - MoodCard         (components/cards)    → blur-panel · 8/5 · scale
 *
 * All radii consume `rounded-card` (18px ≈ the previous magic 1.13rem).
 * The blur panel sizes itself by its content; the previous fixed
 * `bottom-[4.44rem]` reservation is replaced by letting the panel sit on
 * top of the image (the image is no longer cropped).
 */
export function ImageOverlayCard({
  image,
  title,
  description,
  aspectRatio = "8/5",
  overlayStyle = "gradient-bottom",
  overlayIntensity = "default",
  contentPosition = "bottom",
  cta,
  hoverEffect = "scale",
  as = "button",
  onClick,
  href,
  width,
  className,
  imageAlt = "",
  "aria-label": ariaLabel,
}: ImageOverlayCardProps) {
  const Tag = (as === "a" ? "a" : as) as "button" | "a" | "div";
  const isInteractive = as !== "div";
  const wrapperStyle: CSSProperties = {
    aspectRatio,
    ...(width !== undefined ? { width } : null),
  };

  const isBlurPanel = overlayStyle === "blur-panel";
  const isGradientBottom = overlayStyle === "gradient-bottom";

  const overlayClass = isBlurPanel
    ? "" // blur panel is rendered as the content block itself
    : isGradientBottom
      ? GRADIENT_BOTTOM[overlayIntensity]
      : GRADIENT_FULL[overlayIntensity];

  const contentTextClass = isBlurPanel ? "text-ink-900" : "text-white";
  const descriptionTextClass = isBlurPanel
    ? "text-lm-gray-700"
    : "text-white/85";

  const tagProps: Record<string, unknown> = {};
  if (Tag === "button") {
    tagProps.type = "button";
    tagProps.onClick = onClick;
  } else if (Tag === "a") {
    tagProps.href = href;
    if (onClick) tagProps.onClick = onClick;
  } else if (onClick) {
    tagProps.onClick = onClick;
  }

  return (
    <Tag
      {...tagProps}
      aria-label={ariaLabel ?? (isInteractive ? title : undefined)}
      className={cn(
        "group relative block w-full overflow-hidden rounded-card border border-border bg-surface text-left",
        isInteractive &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        HOVER_WRAPPER[hoverEffect],
        className,
      )}
      style={wrapperStyle}
    >
      {/* Background image */}
      <div
        role={imageAlt ? "img" : undefined}
        aria-label={imageAlt || undefined}
        aria-hidden={imageAlt ? undefined : true}
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-lm-gray-700",
          HOVER_IMAGE[hoverEffect],
        )}
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient overlays */}
      {!isBlurPanel && (
        <div className={cn("absolute inset-0 pointer-events-none", overlayClass)} aria-hidden="true" />
      )}

      {/* Content block */}
      {isBlurPanel ? (
        <div className="absolute bottom-0 left-0 right-0 card-blur-content p-4">
          <div className="flex items-center justify-between gap-5">
            <h3 className={cn("text-2xl font-bold leading-none", contentTextClass)}>{title}</h3>
            {cta}
          </div>
          {description && (
            <p className={cn("text-sm mt-1", descriptionTextClass)}>{description}</p>
          )}
        </div>
      ) : (
        <div className={cn("absolute p-4", CONTENT_POSITION[contentPosition])}>
          <div
            className={cn(
              "flex items-start gap-3",
              contentPosition === "center" ? "justify-center flex-col items-center" : "justify-between",
            )}
          >
            <div className="min-w-0">
              <h3 className={cn("text-sm font-semibold", contentTextClass)}>{title}</h3>
              {description && (
                <p className={cn("text-xs mt-0.5", descriptionTextClass)}>{description}</p>
              )}
            </div>
            {cta && <span className={cn("shrink-0", contentTextClass)}>{cta}</span>}
          </div>
        </div>
      )}
    </Tag>
  );
}

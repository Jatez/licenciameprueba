import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarTone = "primary" | "muted" | "neutral";
export type AvatarShape = "circle" | "rounded";
export type AvatarStatus = "online" | "away" | "offline";

export interface AvatarProps {
  /** Image source. If provided and loads OK, the image is rendered. */
  src?: string;
  /** Required when `src` is decorative pass `alt=""`. */
  alt?: string;
  /** 1-3 character fallback when image is missing or fails to load. */
  initials?: string;
  /** Visual size — maps to fixed pixel boxes (20/28/36/48/64). */
  size?: AvatarSize;
  /** Background tone when no image is rendered. */
  tone?: AvatarTone;
  /** circle (default) or rounded square. */
  shape?: AvatarShape;
  /** Optional presence dot rendered bottom-right. */
  status?: AvatarStatus;
  /** Accessible label when the avatar conveys meaning beyond decoration. */
  "aria-label"?: string;
  className?: string;
}

const SIZE_BOX: Record<AvatarSize, string> = {
  xs: "h-5 w-5",
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const SIZE_TEXT: Record<AvatarSize, string> = {
  xs: "text-[9px]",
  sm: "text-[11px]",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
};

const SIZE_ICON: Record<AvatarSize, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-7 w-7",
};

const SIZE_DOT: Record<AvatarSize, string> = {
  xs: "h-1.5 w-1.5 ring-1",
  sm: "h-2 w-2 ring-2",
  md: "h-2.5 w-2.5 ring-2",
  lg: "h-3 w-3 ring-2",
  xl: "h-4 w-4 ring-[3px]",
};

const TONE_BG: Record<AvatarTone, string> = {
  primary: "bg-primary text-primary-foreground",
  muted: "bg-muted text-foreground",
  neutral: "bg-foreground/10 text-foreground",
};

const SHAPE_RADIUS: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-md",
};

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

/**
 * Avatar — circular/rounded surface that renders, in order of preference:
 *   1. An image (if `src` loads successfully)
 *   2. Text initials (1-3 chars)
 *   3. A generic User icon placeholder
 *
 * Use the `tone` prop to control the fallback background. The optional
 * `status` dot is anchored bottom-right and uses a ring matching the
 * surrounding surface so it reads on cards and lists alike.
 */
export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  tone = "muted",
  shape = "circle",
  status,
  className,
  "aria-label": ariaLabel,
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // Reset failure flag when src changes
  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !imgFailed;
  const trimmedInitials = initials?.trim().slice(0, 3).toUpperCase();
  const showInitials = !showImage && Boolean(trimmedInitials);
  const showPlaceholder = !showImage && !showInitials;

  const role = !showImage ? "img" : undefined;
  const computedAriaLabel =
    ariaLabel ??
    (showInitials ? trimmedInitials : showPlaceholder ? "avatar" : undefined);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        SIZE_BOX[size],
        SHAPE_RADIUS[shape],
        !showImage && TONE_BG[tone],
        className,
      )}
      role={role}
      aria-label={computedAriaLabel}
    >
      {showImage && (
        <img
          src={src}
          alt={alt}
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}
      {showInitials && (
        <span
          aria-hidden="true"
          className={cn(
            "select-none font-medium leading-none font-tnum",
            SIZE_TEXT[size],
          )}
        >
          {trimmedInitials}
        </span>
      )}
      {showPlaceholder && (
        <User className={cn(SIZE_ICON[size], "opacity-70")} aria-hidden="true" />
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-background",
            SIZE_DOT[size],
            STATUS_COLOR[status],
          )}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

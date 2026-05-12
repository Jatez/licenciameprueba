import { useState, type ReactNode } from "react";
import { ImageIcon, Play, Radio } from "lucide-react";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PublicationMetric, PublicationPostType } from "../types";

interface PublicationPreviewProps {
  publication: PublicationMetric;
  className?: string;
  imageClassName?: string;
  showTooltip?: boolean;
  children?: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

const VIDEO_POST_TYPES = new Set<PublicationPostType>(["reel", "video", "short", "story"]);

const POST_TYPE_LABELS: Record<PublicationPostType, string> = {
  reel: "Reel",
  story: "Historia",
  post: "Post",
  video: "Video",
  short: "Short",
};

export function getPublicationPostTypeLabel(postType: PublicationPostType) {
  return POST_TYPE_LABELS[postType];
}

export const PLATFORM_FALLBACK_BG: Record<PublicationMetric["platform"], string> = {
  instagram: "from-fuchsia-500/85 via-rose-400/80 to-amber-300/80",
  tiktok: "from-slate-900/95 via-cyan-500/70 to-fuchsia-500/65",
  facebook: "from-sky-700/85 via-indigo-600/80 to-violet-500/70",
};

export function buildPublicationInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PublicationPreview({
  publication,
  className,
  imageClassName,
  showTooltip = true,
  children,
  tooltipSide = "right",
}: PublicationPreviewProps) {
  const isVideoPost = VIDEO_POST_TYPES.has(publication.postType);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [expandedCardFailed, setExpandedCardFailed] = useState(false);
  const initials = buildPublicationInitials(publication.trackTitle);
  const fallbackBg = PLATFORM_FALLBACK_BG[publication.platform];
  const frameClassName =
    publication.postType === "story"
      ? "aspect-[9/16]"
      : isVideoPost
        ? "aspect-[4/5]"
        : "aspect-square";

  const thumbnail = children ?? (
    <span
      className={cn(
        "group/preview relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-black/10 bg-muted shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
        frameClassName,
        className,
      )}
    >
      {publication.trackCoverUrl && !thumbnailFailed ? (
        <img
          src={publication.trackCoverUrl}
          alt={publication.trackTitle}
          loading="lazy"
          onError={() => setThumbnailFailed(true)}
          className={cn("h-full w-full object-cover transition-transform duration-300 group-hover/preview:scale-105", imageClassName)}
        />
      ) : (
        <span className={cn("flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br px-2 text-center text-white", fallbackBg)}>
          <span className="text-sm font-semibold tracking-[0.16em]">
            {initials}
          </span>
          <span className="line-clamp-2 text-[8px] font-medium leading-3 text-white/85">
            {getPublicationPostTypeLabel(publication.postType)}
          </span>
        </span>
      )}

      <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <span className="absolute left-1.5 bottom-1.5 inline-flex items-center rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
        {getPublicationPostTypeLabel(publication.postType)}
      </span>

      <span className="absolute right-1.5 top-1.5 opacity-90">
        <PlatformBadge platform={publication.platform} size="xs" />
      </span>

      {isVideoPost ? (
        <span className="absolute inset-0 flex flex-col justify-between p-2">
          <span className="self-start rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow-sm animate-pulse">
            En preview
          </span>
          <span className="flex items-end justify-between">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
              <Play className="h-3.5 w-3.5 fill-white" aria-hidden="true" />
            </span>
            <span className="ml-3 flex-1 rounded-full bg-white/25 p-[2px] backdrop-blur-sm">
              <span className="block h-1.5 w-2/3 rounded-full bg-lime-300/95 animate-pulse" />
            </span>
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!showTooltip) {
    return thumbnail;
  }

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>{thumbnail}</TooltipTrigger>
        <TooltipContent
          side={tooltipSide}
          align="start"
          sideOffset={12}
          avoidCollisions
          collisionPadding={16}
          sticky="partial"
          className="overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-0 shadow-[0_24px_50px_rgba(15,23,42,0.18)] backdrop-blur-md"
        >
          <div className="w-[204px]">
            <div className={cn(
              "relative overflow-hidden bg-muted",
              isVideoPost ? "aspect-[4/4.45]" : "aspect-[1/0.82]",
            )}>
              {publication.trackCoverUrl ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 bg-cover bg-center bg-no-repeat",
                    isVideoPost && "scale-[1.08] transition-transform duration-700",
                  )}
                  style={{ backgroundImage: `url(${publication.trackCoverUrl})` }}
                />
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(15,23,42,0.06),rgba(15,23,42,0.18))] px-6 text-center text-foreground/55">
                  <ImageIcon className="h-8 w-8" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/75">Preview no disponible</p>
                    <p className="mt-1 text-xs leading-5 text-foreground/60">
                      {publication.trackTitle}
                    </p>
                  </div>
                </span>
              )}

              {publication.trackCoverUrl ? (
                <span className="absolute inset-x-0 bottom-3.5 flex justify-center">
                  <span className="overflow-hidden rounded-2xl border border-white/50 bg-white/85 p-2 shadow-[0_18px_34px_rgba(15,23,42,0.22)] backdrop-blur-sm">
                    {expandedCardFailed ? (
                      <span className={cn("flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gradient-to-br text-white", fallbackBg)}>
                        <span className="text-sm font-semibold tracking-[0.18em]">{initials}</span>
                        <span className="mt-1 text-[9px] font-medium uppercase text-white/80">
                          {publication.platform}
                        </span>
                      </span>
                    ) : (
                      <img
                        src={publication.trackCoverUrl}
                        alt={publication.trackTitle}
                        loading="eager"
                        onError={() => setExpandedCardFailed(true)}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    )}
                  </span>
                </span>
              ) : null}

              <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                {isVideoPost ? <Radio className="h-3 w-3" aria-hidden="true" /> : <ImageIcon className="h-3 w-3" aria-hidden="true" />}
                {isVideoPost ? "Hover preview" : "Vista ampliada"}
              </span>

              {isVideoPost ? (
                <span className="absolute inset-0 flex flex-col justify-between p-4">
                  <span className="self-end rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-foreground shadow-sm animate-pulse">
                    Reproduciendo
                  </span>
                  <span className="flex items-end gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                      <Play className="h-5 w-5 fill-white" aria-hidden="true" />
                    </span>
                    <span className="flex-1 rounded-full bg-white/20 p-[3px] backdrop-blur-sm">
                      <span className="block h-2 w-3/5 rounded-full bg-lime-300 animate-pulse" />
                    </span>
                  </span>
                </span>
              ) : null}
            </div>

            <div className="space-y-1 px-3 py-2">
              <p className="line-clamp-1 text-[13px] font-semibold text-foreground">
                {publication.trackTitle}
              </p>
              <p className="line-clamp-1 text-[11px] text-muted-foreground">
                {publication.trackArtist}
              </p>
              <div className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {getPublicationPostTypeLabel(publication.postType)} · {publication.platform}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
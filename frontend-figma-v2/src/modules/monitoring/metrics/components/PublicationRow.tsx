/**
 * F-11 · Single row of the publications table (desktop).
 * Click navigates to detail. External-link button opens postUrl in new tab.
 */
import { ExternalLink, Play } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatPercent, useFormatDate } from "@/shared/format";
import { publicationDetailPath } from "../routes";
import { useTypeLabels, metricsStrings, platformLabels } from "../strings";
import { publicationEngagementRate, publicationInteractions } from "../selectors/computeEngagement";
import { PublicationStatusBadge } from "./PublicationStatusBadge";
import type { PublicationMetric } from "../types";

interface PublicationRowProps {
  publication: PublicationMetric;
  visibleColumns: Set<PublicationColumnKey>;
  onOpen: (id: string) => void;
}

export type PublicationColumnKey =
  | "preview"
  | "track"
  | "platform"
  | "date"
  | "useType"
  | "views"
  | "interactions"
  | "engagement"
  | "status"
  | "actions";

const VIDEO_POST_TYPES = new Set(["reel", "video", "short", "story"]);

export function PublicationRow({
  publication: p,
  visibleColumns,
  onOpen,
}: PublicationRowProps) {
  const { relative, longWithTime } = useFormatDate();
  const isMuted = p.syncStatus === "no_data";

  const handleRowKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onOpen(p.id);
  };

  const isVideoPost = VIDEO_POST_TYPES.has(p.postType);

  return (
    <TableRow
      tabIndex={0}
      role="button"
      aria-label={metricsStrings.table.rowOpenAria}
      onClick={() => onOpen(p.id)}
      onKeyDown={handleRowKey}
      className={cn(
        "cursor-pointer transition-colors hover:bg-foreground/[0.03]",
        isMuted && "opacity-60",
      )}
    >
      {visibleColumns.has("preview") && (
        <TableCell className="w-14 p-2">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="group/preview relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted"
                  onClick={(e) => e.stopPropagation()}
                >
                  {p.trackCoverUrl ? (
                    <img
                      src={p.trackCoverUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PlatformBadge platform={p.platform} size="xs" />
                  )}
                  {isVideoPost && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover/preview:bg-black/40"
                    >
                      <Play className="h-4 w-4 fill-white text-white" />
                    </span>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" align="start" className="p-2">
                <div className="relative h-[200px] w-[200px] overflow-hidden rounded-md bg-muted">
                  {p.trackCoverUrl ? (
                    <img
                      src={p.trackCoverUrl}
                      alt={p.trackTitle}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs text-foreground/40">
                      Sin preview
                    </span>
                  )}
                  {isVideoPost && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-black/30"
                    >
                      <Play className="h-10 w-10 fill-white text-white" />
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-1 max-w-[200px] text-xs text-foreground/70">
                  {p.trackTitle}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      )}
      {visibleColumns.has("track") && (
        <TableCell className="min-w-[220px]">
          <div className="flex items-center gap-3">
            <img
              src={p.trackCoverUrl}
              alt=""
              loading="lazy"
              className="h-9 w-9 flex-shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {p.trackTitle}
              </p>
              <p className="truncate text-xs text-foreground/60">{p.trackArtist}</p>
            </div>
          </div>
        </TableCell>
      )}
      {visibleColumns.has("platform") && (
        <TableCell>
          <div className="flex items-center gap-2">
            <PlatformBadge platform={p.platform} size="xs" />
            <span className="text-xs text-foreground/70">{platformLabels[p.platform]}</span>
          </div>
        </TableCell>
      )}
      {visibleColumns.has("date") && (
        <TableCell>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-xs text-foreground/80">
                  {relative(p.publishedAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {longWithTime(p.publishedAt)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      )}
      {visibleColumns.has("useType") && (
        <TableCell>
          <Badge variant="info" className="whitespace-nowrap text-[11px]">
            {useTypeLabels[p.licenseUseType]}
          </Badge>
        </TableCell>
      )}
      {visibleColumns.has("views") && (
        <TableCell className="text-right font-tnum text-sm text-foreground">
          {p.syncStatus === "partial" || p.syncStatus === "no_data"
            ? "—"
            : formatCompactNumber(p.views)}
        </TableCell>
      )}
      {visibleColumns.has("interactions") && (
        <TableCell className="text-right font-tnum text-sm text-foreground">
          {p.syncStatus === "no_data" ? "—" : formatCompactNumber(publicationInteractions(p))}
        </TableCell>
      )}
      {visibleColumns.has("engagement") && (
        <TableCell className="text-right font-tnum text-sm text-foreground">
          {p.syncStatus === "synced"
            ? formatPercent(publicationEngagementRate(p), { decimals: 1 })
            : "—"}
        </TableCell>
      )}
      {visibleColumns.has("status") && (
        <TableCell>
          <PublicationStatusBadge status={p.syncStatus} syncError={p.syncError} />
        </TableCell>
      )}
      {visibleColumns.has("actions") && (
        <TableCell className="text-right">
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {p.postUrl !== "—" && (
              <a
                href={p.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={metricsStrings.table.openExternal}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export { publicationDetailPath };

/**
 * F-11 · Single row of the publications table (desktop).
 * Click navigates to detail. External-link button opens postUrl in new tab.
 */
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatPercent, useFormatDate } from "@/shared/format";
import { publicationDetailPath } from "../routes";
import { useTypeLabels, metricsStrings } from "../strings";
import { publicationEngagementRate, publicationInteractions } from "../selectors/computeEngagement";
import { PublicationStatusBadge } from "./PublicationStatusBadge";
import { buildPublicationInitials, PLATFORM_FALLBACK_BG, PublicationPreview } from "./PublicationPreview";
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

export function PublicationRow({
  publication: p,
  visibleColumns,
  onOpen,
}: PublicationRowProps) {
  const { relative, longWithTime } = useFormatDate();
  const isMuted = p.syncStatus === "no_data";
  const [trackImageFailed, setTrackImageFailed] = useState(false);
  const trackInitials = buildPublicationInitials(p.trackTitle);
  const trackFallbackBg = PLATFORM_FALLBACK_BG[p.platform];

  const handleRowKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onOpen(p.id);
  };
  return (
    <TableRow
      tabIndex={0}
      role="button"
      aria-label={metricsStrings.table.rowOpenAria}
      onClick={() => onOpen(p.id)}
      onKeyDown={handleRowKey}
      className={cn(
        "cursor-pointer transition-colors hover:bg-foreground/[0.025]",
        isMuted && "opacity-60",
      )}
    >
      {visibleColumns.has("preview") && (
        <TableCell className="w-[72px] py-1.5 pl-3 pr-2">
          <span onClick={(e) => e.stopPropagation()}>
            <PublicationPreview
              publication={p}
              className="w-11"
            />
          </span>
        </TableCell>
      )}
      {visibleColumns.has("track") && (
        <TableCell className="min-w-[220px] px-3 py-1.5">
          <span onClick={(e) => e.stopPropagation()}>
            <PublicationPreview publication={p} tooltipSide="right">
                <span className="group/preview flex items-center gap-2 rounded-xl px-1 py-0.5">
                {p.trackCoverUrl && !trackImageFailed ? (
                  <img
                    src={p.trackCoverUrl}
                    alt=""
                    loading="lazy"
                    onError={() => setTrackImageFailed(true)}
                    className="h-8 w-8 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-semibold tracking-[0.14em] text-white", trackFallbackBg)}>
                    {trackInitials}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium leading-5 text-foreground">
                    {p.trackTitle}
                  </span>
                  <span className="block truncate text-[11px] leading-[1.1rem] text-foreground/60">{p.trackArtist}</span>
                </span>
              </span>
            </PublicationPreview>
          </span>
        </TableCell>
      )}
      {visibleColumns.has("platform") && (
        <TableCell className="px-3 py-2">
          <div className="flex items-center gap-2">
            <PlatformBadge platform={p.platform} size="xs" />
            <span className="text-[11px] text-foreground/70">{platformLabels[p.platform]}</span>
          </div>
        </TableCell>
      )}
      {visibleColumns.has("date") && (
        <TableCell className="px-3 py-2">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-[11px] text-foreground/80">
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
        <TableCell className="px-3 py-2">
          <Badge variant="info" className="whitespace-nowrap px-2 py-0.5 text-[10px]">
            {useTypeLabels[p.licenseUseType]}
          </Badge>
        </TableCell>
      )}
      {visibleColumns.has("views") && (
        <TableCell className="px-3 py-2 text-right font-tnum text-[13px] text-foreground">
          {p.syncStatus === "partial" || p.syncStatus === "no_data"
            ? "—"
            : formatCompactNumber(p.views)}
        </TableCell>
      )}
      {visibleColumns.has("interactions") && (
        <TableCell className="px-3 py-2 text-right font-tnum text-[13px] text-foreground">
          {p.syncStatus === "no_data" ? "—" : formatCompactNumber(publicationInteractions(p))}
        </TableCell>
      )}
      {visibleColumns.has("engagement") && (
        <TableCell className="px-3 py-2 text-right font-tnum text-[13px] text-foreground">
          {p.syncStatus === "synced"
            ? formatPercent(publicationEngagementRate(p), { decimals: 1 })
            : "—"}
        </TableCell>
      )}
      {visibleColumns.has("status") && (
        <TableCell className="px-3 py-2">
          <PublicationStatusBadge status={p.syncStatus} syncError={p.syncError} />
        </TableCell>
      )}
      {visibleColumns.has("actions") && (
        <TableCell className="px-3 py-2 text-right">
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

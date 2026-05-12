/**
 * F-11 · Mobile card for a publication. Stacked layout for <md screens.
 */
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatPercent, useFormatDate } from "@/shared/format";
import { metricsStrings, useTypeLabels } from "../strings";
import { publicationEngagementRate, publicationInteractions } from "../selectors/computeEngagement";
import { PublicationStatusBadge } from "./PublicationStatusBadge";
import { PublicationPreview } from "./PublicationPreview";
import type { PublicationMetric } from "../types";

interface PublicationCardMobileProps {
  publication: PublicationMetric;
  onOpen: (id: string) => void;
}

export function PublicationCardMobile({
  publication: p,
  onOpen,
}: PublicationCardMobileProps) {
  const { relative } = useFormatDate();
  const isMuted = p.syncStatus === "no_data";

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onOpen(p.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(p.id)}
      className={cn("p-3", isMuted && "opacity-60")}
    >
      <div className="flex items-center gap-3">
        <PublicationPreview
          publication={p}
          showTooltip={false}
          className="h-12 w-12"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{p.trackTitle}</p>
          <p className="truncate text-xs text-foreground/60">{p.trackArtist}</p>
        </div>
        <PlatformBadge platform={p.platform} size="sm" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="info" className="text-[11px]">
          {useTypeLabels[p.licenseUseType]}
        </Badge>
        <PublicationStatusBadge status={p.syncStatus} syncError={p.syncError} />
        <span className="ml-auto text-xs text-foreground/60">{relative(p.publishedAt)}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-foreground/5 pt-3">
        <Stat label={metricsStrings.table.columns.views}
              value={p.syncStatus === "partial" || p.syncStatus === "no_data"
                ? "—"
                : formatCompactNumber(p.views)} />
        <Stat label={metricsStrings.table.columns.interactions}
              value={p.syncStatus === "no_data" ? "—" : formatCompactNumber(publicationInteractions(p))} />
        <Stat label={metricsStrings.table.columns.engagement}
              value={p.syncStatus === "synced"
                ? formatPercent(publicationEngagementRate(p), { decimals: 1 })
                : "—"} />
      </div>

      {p.postUrl !== "—" && (
        <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
          <a
            href={p.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={metricsStrings.table.openExternal}
            className="inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            {metricsStrings.table.openExternal}
          </a>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-foreground/50">{label}</span>
      <span className="font-tnum text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

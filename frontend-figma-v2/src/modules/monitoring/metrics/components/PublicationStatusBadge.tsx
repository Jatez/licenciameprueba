/**
 * F-11 · Status badge for a publication's sync state.
 * Uses semantic Badge variants; no inline colors.
 */
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { PublicationSyncStatus } from "../types";
import { metricsStrings, syncStatusLabels } from "../strings";

interface PublicationStatusBadgeProps {
  status: PublicationSyncStatus;
  syncError?: string;
}

const variantByStatus: Record<
  PublicationSyncStatus,
  "vigente" | "consumida" | "expirada" | "pendiente" | "info"
> = {
  synced: "vigente",
  syncing: "info",
  partial: "pendiente",
  failed: "expirada",
  no_data: "consumida",
};

export function PublicationStatusBadge({ status, syncError }: PublicationStatusBadgeProps) {
  const tooltipText =
    syncError ??
    metricsStrings.table.syncTooltips[status] ??
    syncStatusLabels[status];

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variantByStatus[status]} className="cursor-help">
            {syncStatusLabels[status]}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

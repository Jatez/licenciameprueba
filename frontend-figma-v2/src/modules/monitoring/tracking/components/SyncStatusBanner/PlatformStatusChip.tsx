import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TrackingSyncStatus } from "@/api/types";
import { PlatformIcon } from "../shared/PlatformIcon";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";
import { formatRelativeFromNow } from "@/modules/monitoring/tracking/utils/relativeTime";

interface PlatformStatusChipProps {
  platform: TrackingSyncStatus["platforms"][number];
}

const ICON_BY_STATUS = {
  ok: CheckCircle2,
  rate_limited: AlertTriangle,
  token_expired: AlertTriangle,
  error: AlertTriangle,
  no_accounts: XCircle,
} as const;

const COLOR_BY_STATUS: Record<string, string> = {
  ok: "text-foreground",
  rate_limited: "text-foreground",
  token_expired: "text-foreground",
  error: "text-foreground",
  no_accounts: "text-foreground",
};

export function PlatformStatusChip({ platform }: PlatformStatusChipProps) {
  const StatusIcon = ICON_BY_STATUS[platform.status];
  const platformLabel =
    trackingStrings.syncStatus.platformLabels[platform.platform];

  let tooltipText = "";
  if (platform.status === "ok") {
    tooltipText =
      platform.lastSyncAt
        ? trackingStrings.syncStatus.lastSync.replace(
            "{duration}",
            formatRelativeFromNow(platform.lastSyncAt),
          )
        : trackingStrings.syncStatus.platformOk.replace("{platform}", platformLabel);
  } else if (platform.status === "rate_limited") {
    tooltipText = trackingStrings.syncStatus.platformError.rate_limited.replace(
      "{platform}",
      platformLabel,
    );
  } else if (platform.status === "token_expired") {
    tooltipText = trackingStrings.syncStatus.platformError.token_expired.replace(
      "{platform}",
      platformLabel,
    );
  } else if (platform.status === "no_accounts") {
    tooltipText = trackingStrings.syncStatus.platformError.no_accounts.replace(
      "{platform}",
      platformLabel,
    );
  } else {
    tooltipText = trackingStrings.syncStatus.platformError.error.replace(
      "{platform}",
      platformLabel,
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs"
          aria-label={`${platformLabel}: ${tooltipText}`}
        >
          <PlatformIcon platform={platform.platform} size={14} aria-hidden="true" />
          <span className="font-medium">{platformLabel}</span>
          <StatusIcon
            size={12}
            className={COLOR_BY_STATUS[platform.status]}
            aria-hidden="true"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="text-xs">{tooltipText}</span>
      </TooltipContent>
    </Tooltip>
  );
}

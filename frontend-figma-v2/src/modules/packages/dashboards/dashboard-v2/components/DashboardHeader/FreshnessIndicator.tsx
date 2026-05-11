import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardFreshness } from "@/api/types.dashboard";
import { dashboardV2Strings, fmt } from "../../strings";
import { useFormatDate } from "../../hooks";

interface FreshnessIndicatorProps {
  freshness: DashboardFreshness;
}

/** Pill chip with pulse dot — green (fresh) / amber (stale) / red (error). */
export function FreshnessIndicator({ freshness }: FreshnessIndicatorProps) {
  const { relative } = useFormatDate();
  const t = dashboardV2Strings.header;

  if (freshness.syncStatus === "stale") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning-subtle px-2.5 py-1 text-xs font-medium text-foreground">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />
        <span>{t.lastUpdatedStale}</span>
      </span>
    );
  }

  const isError = freshness.syncStatus === "error";
  const dotColor = isError ? "bg-error" : "bg-metric-subtle";
  const containerCls = isError
    ? "border-error/30 bg-error-subtle text-foreground"
    : "border-border bg-card text-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        containerCls,
      )}
    >
      <span className="relative inline-flex h-2 w-2" aria-hidden="true">
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", dotColor)} />
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dotColor)} />
      </span>
      <span>{fmt(t.lastUpdated, { time: relative(freshness.lastSyncAt) })}</span>
    </span>
  );
}
